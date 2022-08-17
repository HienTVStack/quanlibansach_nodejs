const Accounts = require('../../models/accounts');
const Books = require('../../models/books');
const Categories = require('../../models/categories');
const mongoose = require('mongoose')
const session = require("express-session");
class APIController {
    //[GET] /api/cart
    apiCart(req, res, next) {
        Categories.find({})
            .then((result) => res.json(result))
            .catch(next)
    }
    //[GET] /api/books
    apiBooks(req, res, next) {
        Books.find({})
            .then((books) => res.json(books))
            .catch(next)
    }
    //[GET] /api/accounts
    apiAccounts(req, res, next) {
        Accounts.find({})
            .then((account) => res.json(account));
    }
    //[GET] /api/cartSumPrice
    apiCartAggregate(req, res, next) {
        Cart.aggregate([{$group: {_id: "$products", sum: {$sum: "$price"}}}])
            .then((cart) => res.json(cart))
            .catch(next)
    }
    
}

module.exports = new APIController;