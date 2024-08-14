const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);	
router.post('/forgotPassword', authController.forgetPassword);
router.post('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsers).post(userController.getUser);
router.route('/:id').get(userController.getUser);

module.exports = router;
