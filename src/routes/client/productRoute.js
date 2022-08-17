const express = require('express');
const router = express.Router();
const productsController = require('../../app/controllers/Client/ProductsController');

router.get('/tim-kiem', productsController.search);
router.get('/:id/chi-tiet', productsController.detail);
router.post('/:id/danh-gia', productsController.reviewProduct);


module.exports = router;

