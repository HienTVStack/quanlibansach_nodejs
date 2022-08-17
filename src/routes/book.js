const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/UploadImageMiddleware');
const isLoginMiddleware = require('../app/middlewares/IsLoginMiddleware');
const booksController = require('../app/controllers/Server/BooksController');

router.post('/nhap-hang', booksController.importGoods);
router.get('/don-dat-hang', booksController.readOrderDocuments);
router.post('/xuat-file-dat-hang', booksController.exportByExcel);
router.post('/test', booksController.test);
router.get('/ket-qua-dat-hang', booksController.resultOrder);
router.get('/dat-hang', isLoginMiddleware, booksController.order);
router.post('/nha-cung-cap', booksController.suppliers);
router.get('/them-moi',isLoginMiddleware, booksController.create);
router.post('/stored',upload.single('image'),  booksController.stored);
router.get('/show', isLoginMiddleware, booksController.show);
router.get('/:id/edit', booksController.edit);
router.post('/hand-form-action', booksController.handFormAction);
router.put('/:id', booksController.update);
router.post('/:id/update-status', booksController.updateStatus);
router.post('/:id/destroy', booksController.destroy);
router.delete('/:id', booksController.delete);
router.delete('/:id/force', booksController.forceDelete);
router.patch('/:id/restored', booksController.restored);

module.exports = router;