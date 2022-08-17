const express = require('express');
const router = express.Router();
const categoryController = require('../app/controllers/Server/CategoryController');

router.get('/them-the-loai', categoryController.create);
router.post('/add-category', categoryController.addCategory);

module.exports = router;