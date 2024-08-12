const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.get('/login', authController.login);	

router.route('/').get(userController.getAllUsers).post(userController.getUser);
router.route('/:id').get(userController.getUser);

module.exports = router;
