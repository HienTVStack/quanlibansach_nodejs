const express = require('express');
const router = express.Router();
const path = require('path');
const accountController = require('../../app/controllers/Client/AccountController');
// const isLoginMiddleware = require('../app/middlewares/IsLoginMiddleware');

// router.get('/logout', accountController.logout);
// router.get('/register', accountController.register);
// router.post('/register', accountController.addAccount);
router.get('/dang-nhap', accountController.login);
router.post('/dang-nhap', accountController.checkLogin);
router.get('/dang-ki', accountController.register);
router.post('/dang-ki', accountController.addAccount);
router.get('/dang-xuat', accountController.logout);

module.exports = router;