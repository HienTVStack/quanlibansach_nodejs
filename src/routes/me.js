const express = require('express');
const router = express.Router();
const path = require('path');
const meController = require('../app/controllers/Server/MeController');
const isLoginMiddleware = require('../app/middlewares/IsLoginMiddleware');

router.get('/cua-hang/sach', isLoginMiddleware, meController.stored);
router.get('/thung-rac/sach', isLoginMiddleware, meController.trash);

module.exports = router;