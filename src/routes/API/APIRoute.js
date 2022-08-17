const express = require('express');
const router = express.Router();
const path = require('path');
const APIController = require('../../app/controllers/API/APIController');

router.get('/books', APIController.apiBooks);
router.get('/accounts', APIController.apiAccounts);
router.get('/cartSumPrice', APIController.apiCartAggregate);
router.get('/cart', APIController.apiCart);

module.exports = router;