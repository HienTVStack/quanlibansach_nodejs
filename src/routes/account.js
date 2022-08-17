const express = require('express');
const router = express.Router();
const path = require('path');
const accountController = require('../app/controllers/Server/AccountController');
const isLoginMiddleware = require('../app/middlewares/IsLoginMiddleware');

router.get('/dang-xuat', accountController.logout);
router.get('/dang-ki', accountController.register);
router.post('/dang-ki', accountController.addAccount);
router.get('/dang-nhap', accountController.login);
router.post('/dang-nhap', accountController.checkLogin);

module.exports = router;