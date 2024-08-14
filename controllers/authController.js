const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please Provide Email and Password'), 400);
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
    }
    const token = signToken(user._id);

    res.status(201).json({
        status: 'success',
        token,
    })
});
exports.protect = catchAsync(async (req, res, next) => {
    // get token
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log('Token :', token);
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to access this route.', 401));
    }
    // verification token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('decoded :', decoded);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next();
    }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
    
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new AppError('No user found with that email', 404));
    }
    
    
    const resetToken = user.createPasswordResetToken();
    console.log(resetToken);
    await user.save({validateBeforeSave: false})

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
   try {
    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message: `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. If you didn't forget your password, please ignore this email!`
    });
    
    res.status(200).json({
        status:'success',
        message: 'Token sent to email'
    });
   } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});
    return next(new AppError('There was an error sending the email. Try again later!'), 500);
   }
    
    
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    
    if(!user){
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = signToken(user._id);
    
    res.status(200).json({
        status:'success',
        message: 'Password updated successfully!',
        token
    });
    
});