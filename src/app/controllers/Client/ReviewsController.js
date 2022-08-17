const Books = require('../../models/books');
const Accounts = require('../../models/accounts');
const {multipleMongooseToObject, mongooseToObject} = require('../../../util/mongoose');
const mongoose = require('mongoose');

class ReviewsController {
    //[GET] /danh-gia/san-pham-da-mua
    productsCompleted(req, res, next) {
        let userName = "Đăng nhập";
        if(req.session.isLogin) {
            const idUser = req.session.idUser;
            userName = req.session.userName;

            Accounts.aggregate([{$unwind: "$order"}, {$project: {_id: 1, "order.products": 1}}, {$match: {_id: mongoose.Types.ObjectId(idUser) }}])
                .then(product => res.render('./client/review/product-completed', {
                    product,
                    title: "Đợi đánh giá",
                    userName,
                }))
                // .then(product => res.json(product))
                .catch(next)
        }
        else {
            res.redirect('/tai-khoan/dang-nhap')
        }
    }
    //[GET] /danh-gia/:id/detail
    productDetailReview(req, res, next) {
        if(req.session.isLogin) {
            const queryBookToCategory = Books.find({}).limit(8);
            const countReviews = Books.aggregate([{$match: {_id: (require('mongoose').Types.ObjectId(req.params.id))}},
                                    {$project: { _id: 0, reviews: 1, "count": {"$size": { "$ifNull": [ "$reviews", []]}}}}])
            const queryUser = Accounts.findById(req.session.idUser);
            Promise.all([Books.findById(req.params.id), countReviews, queryBookToCategory, queryUser])
                .then(([books, count, bookToType, user]) => {
                    books.quantityView = books.quantityView + 1
                    books.save()
                    res.render('./client/review/detail-review-product' ,{
                        title: 'Chi tiết sản phẩm',
                        count,
                        books: mongooseToObject(books),
                        bookToType: multipleMongooseToObject(bookToType),
                        user: mongooseToObject(user),
                        userName: req.session.userName,
                    })
                })
                .catch(next)
        }
        else {
            res.redirect('/tai-khoan/dang-nhap');
        }
        
    }
}

module.exports = new ReviewsController;