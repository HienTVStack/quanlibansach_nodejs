const express = require('express');
const router = express.Router();
const reviewsController = require('../../app/controllers/Client/ReviewsController');

router.get('/san-pham-da-mua', reviewsController.productsCompleted);
router.get('/:id/detail', reviewsController.productDetailReview);


module.exports = router;

