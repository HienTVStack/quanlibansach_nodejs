const express = require('express');
const router = express.Router();
const meController = require('../../app/controllers/Client/MeController');

router.get('/tin-nhan', meController.message);
router.post('/hand-form-action', meController.handFormAction);
router.post('/sendMail', meController.sendMail);
router.post('/:id/addCart', meController.addCart);
router.get('/shop', meController.shop);
router.get('/gio-hang', meController.cart);
router.get('/contact', meController.contact);
router.post('/:id/deletedCart', meController.deletedItemCart);
router.get('/dat-hang', meController.checkout);
router.post('/dat-hang', meController.order);
router.get('/', meController.shop);

module.exports = router;