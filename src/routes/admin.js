const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/Server/AdminController');
const isLoginMiddleware = require('../app/middlewares/IsLoginMiddleware');

router.get('/tin-nhan', adminController.messageBox);
router.get('/content-analysis',isLoginMiddleware, adminController.contentAnalysis);
router.get('/quan-li-lien-he', isLoginMiddleware, adminController.contact);
router.get('/them-thong-tin-lien-he', isLoginMiddleware, adminController.addContactGET);
router.post('/contact-add', isLoginMiddleware, adminController.addContactPOST);
router.delete('/deleted-contact/:id', adminController.deletedContact);
router.post('/:id/update-contact', adminController.updateContact);

module.exports = router;
