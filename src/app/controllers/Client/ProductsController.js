const { mongooseToObject, multipleMongooseToObject } = require('../../../util/mongoose');
const Books = require('../../models/books');
const Accounts = require('../../models/accounts');
const mongoose = require('mongoose');
class ProductsController {
    // [GET] /product/:id/detail
    detail(req, res, next) {
        let userName = "Đăng nhập"
        if(req.session.idLogin) {
            userName = req.session.userName;
        }
        // const queryReviews = Books.aggregate([{$unwind: "$reviews"}, {$project: { reviews: 1, author: 1}}]);
        const queryBookToCategory = Books.find({}).limit(8);
        const countReviews = Books.aggregate([{$match: {_id: (require('mongoose').Types.ObjectId(req.params.id))}},
                                {$project: { _id: 0, reviews: 1, "count": {"$size": { "$ifNull": [ "$reviews", []]}}}}])
        Promise.all([Books.findById(req.params.id), countReviews, queryBookToCategory])
            .then(([books, count, bookToType]) => {
                books.quantityView = books.quantityView + 1
                books.save()
                res.render('client/products/detail' ,{
                    title: 'Chi tiết sản phẩm',
                    count,
                    books: mongooseToObject(books),
                    bookToType: multipleMongooseToObject(bookToType),
                    userName,
                })
            })
            .catch(next)
    }
    // [POST] /products/:id/reviews
    reviewProduct(req, res, next) {
        const updateReview = {
            name: req.body.name,
            email: req.body.email,
            reviewText: req.body.reviewText,
            star: req.body.rating
        }
        
        const deleted = Accounts.updateOne({_id: mongoose.Types.ObjectId(req.session.idUser)}, 
                            {$pull: {order: {"products.id": mongoose.Types.ObjectId(req.params.id)}}})
        const review = Books.updateOne({ _id: req.params.id }, { $push: {reviews: updateReview}})
            // .then(() => res.redirect('back'))
            // .catch(next)
        Promise.all([deleted, review])
            .then(() => res.redirect('back'))
            .catch(next)
    }
    // [POST] /products/search
    search(req, res, next) {
        const keyword = req.query.keyword;
        var userName = "Đăng nhập";

        if(req.session.idUser) {
            userName = req.session.userName;
        }
        Books.find({name: { $regex: keyword, $options: '$i' }})
            .then(books => res.render('client/me/search-product', {
                title: 'Tìm kiếm',
                books: multipleMongooseToObject(books),
                userName,
            }))
            .catch(next);
    }
    
    
}

module.exports = new ProductsController;