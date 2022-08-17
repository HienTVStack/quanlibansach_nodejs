const {
    multipleMongooseToObject,
    mongooseToObject
} = require("../../../util/mongoose");
const Books = require("../../models/books");
const Categories = require("../../models/categories");
const Accounts = require("../../models/accounts");
const Contact = require("../../models/contact");
const Payments = require("../../models/payments");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");
const paypal = require("paypal-rest-sdk");

class MeController {
    shop(req, res, next) {
        const booksQuery = Books.find({
            status: true
        });
        const countBooksByType = Categories.aggregate([{
            $group: {
                _id: "$type",
                countByType: {
                    $sum: 1
                }
            }
        }]);
        if (req.query.hasOwnProperty("_sort")) {
            booksQuery = booksQuery.sort({
                [req.query.column]: req.query.type,
            });
        }
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit; //Bắt đầu lấy từ đâu
        const endIndex = page * limit; // Bỏ qua N docs

        const result = {};
        if (endIndex < Books.countDocuments()) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }

        Promise.all([booksQuery.limit(9).skip(startIndex), Books.countDocuments(), Categories.find({}), countBooksByType])
            .then(([books, countBooks, categories, countByType, pageNumber]) => {
                if (req.session.isLogin) {
                    res.render("./client/me/shop", {
                        countBooks,
                        categories: multipleMongooseToObject(categories),
                        countByType,
                        pageNumber: Math.ceil(countBooks / 9) + 1,
                        books: multipleMongooseToObject(books),
                        userName: req.session.userName,
                    });
                } else {
                    res.render("./client/me/shop", {
                        countBooks,
                        categories: multipleMongooseToObject(categories),
                        countByType,
                        pageNumber: Math.ceil(countBooks / 9) + 1,
                        books: multipleMongooseToObject(books),
                        userName: "Đăng nhập",
                    });
                }
            })
            .catch(next);
    }
    // [GET] /contact
    contact(req, res, next) {
        var userName = "Đăng nhập";
        if (req.session.isLogin) {
            userName = req.session.userName;
        }
        Contact.find({}).then((contact) =>
            res.render("./client/me/contact", {
                contact: multipleMongooseToObject(contact),
                title: "Liên hệ",
                userName,
            })
        );
    }
    // [POST] /:id/addCart
    addCart(req, res, next) {
        if (req.session.isLogin) {
            Books.findById(req.params.id)
                .then((book) => {
                    const product = {
                        id: book._id,
                        name: book.name,
                        price: book.price,
                        quantity: 1,
                        image: book.image,
                    };
                    Accounts.updateOne({
                            _id: mongoose.Types.ObjectId(req.session.idUser)
                        }, {
                            $push: {
                                "cart.products": product
                            }
                        })
                        .then(() => res.redirect("back"))
                        .catch(next);
                })
                .catch(next);
        } else {
            res.redirect("/tai-khoan/dang-nhap");
        }
    }
    // [GET] /gio-hang
    cart(req, res, next) {
        var userName = "Đăng nhập";

        if (req.session.isLogin) {
            userName = req.session.userName;

            Accounts.aggregate([{
                        $unwind: "$cart"
                    },
                    {
                        $project: {
                            _id: 1,
                            "cart.products": 1
                        }
                    },
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(req.session.idUser)
                        },
                    },
                ])
                .then((cart) =>
                    res.render("./client/me/cart", {
                        cart,
                        title: "Giỏ hàng",
                        userName,
                    })
                )
                .catch(next);
        } else {
            res.redirect("/tai-khoan/dang-nhap");
        }
    }
    //[POST] /:id/deletedCart
    deletedItemCart(req, res, next) {
        if (req.session.isLogin) {
            const idUser = req.session.idUser;
            console.log(idUser);
            Accounts.updateOne({
                    _id: mongoose.Types.ObjectId(idUser)
                }, {
                    $pull: {
                        "cart.products": {
                            id: mongoose.Types.ObjectId(req.params.id)
                        },
                    },
                })
                .then(() => res.redirect("back"))
                .catch(next);

            //end
        } else {
            res.redirect("/tai-khoan/dang-nhap");
        }
    }
    //[GET] /dat-hang
    checkout(req, res, next) {
        res.render("./client/me/checkout");
    }
    //[POST] /dat-hang
    order(req, res, next) {
        // res.json(req.body);
        if (req.session.isLogin) {
            let address;
            let updateAddress;
            let productsList = [];
            let productsItem = {};
            let idBooks = req.session.idOrder;
            let idUser = req.session.idUser;
            let totalItem = 0;
            let itemPaypal = {};
            var listItemPaypal = [];
            var isCheckSaveAddress = false;
            if (req.body.checkedAddress === "on") {
                isCheckSaveAddress = true;
            }

            //Check save address
            if (isCheckSaveAddress) {
                address = req.body.address;
                Accounts.updateOne({
                        _id: mongoose.Types.ObjectId(req.session.idUser)
                    }, {
                        $set: {
                            address: address
                        }
                    })
                    // .then(next())
                    // .catch(next);
            }
            for (let i = 0; i < idBooks.length; i++) {
                const deletedBook = Accounts.updateOne({
                    _id: mongoose.Types.ObjectId(idUser)
                }, {
                    $pull: {
                        "cart.products": {
                            id: mongoose.Types.ObjectId(idBooks[i])
                        },
                    },
                });
                const queryBook = Books.findById(idBooks[i]);
                //
                Promise.all([queryBook, deletedBook])
                    .then(([book]) => {
                        productsItem = {
                            id: book._id,
                            price: book.price,
                            name: book.name,
                            image: book.image,
                        };
                        book.quantitySell = book.quantitySell + 1;
                        book.quantityStock = book.quantityStock - 1;
                        book.save();
                        productsList.push(productsItem);

                        if (i == idBooks.length - 1) {
                            const order = {
                                address: req.body.address,
                                products: productsList,
                                payment: {
                                    name: req.body.payment,
                                },
                            };
                            Accounts.updateOne({
                                _id: mongoose.Types.ObjectId(req.session.idUser)
                            }, {
                                $push: {
                                    order: order
                                }
                            })
                            //Accounts.updateOne({ _id: mongoose.Types.ObjectId(req.session.idUser) }, { $push: { order: order } })
                            // .then(() => res.redirect("/shop"))
                            // .catch(next);
                            productsList.forEach((item, index) => {
                                totalItem += parseFloat(item.price);
                                itemPaypal = {
                                    "name": item.name,
                                    "sku": index,
                                    "price": item.price,
                                    "currency": "USD",
                                    "quantity": 1
                                }
                                listItemPaypal.push(itemPaypal);
                            })
                            console.log(listItemPaypal)
                            // paypal
                            setTimeout(() => {
                                var create_payment_json = {
                                    intent: "sale",
                                    payer: {
                                        payment_method: "paypal",
                                    },
                                    redirect_urls: {
                                        return_url: "http://localhost:3000/ok",
                                        cancel_url: "http://localhost:3000/canel",
                                    },
                                    "transactions": [{
                                        "item_list": {
                                            "items": [{
                                                "name": "item",
                                                "sku": "item",
                                                "price": "1.00",
                                                "currency": "USD",
                                                "quantity": 1
                                            }]
                                        },
                                        "amount": {
                                            "currency": "USD",
                                            "total": "1.00"
                                        },
                                        "description": "This is the payment description."
                                    }]
                                };

                                paypal.payment.create(create_payment_json, function (error, payment) {
                                    if (error) {
                                        throw error;
                                    } else {
                                        // console.log("Create Payment Response");
                                        // console.log(payment);
                                        for (let i = 0; i < payment.links.length; i++) {
                                            if (payment.links[i].rel === "approval_url") {
                                                res.redirect(payment.links[i].href);
                                            }
                                        }
                                    }
                                });
                                //end paypal
                            }, 2000)
                        }
                    })
                    .catch(next);
            }


        } else {
            res.redirect("/tai-khoan/dang-nhap");
        }
    }
    // [POST] /hand-form-action
    handFormAction(req, res, next) {
        //res.json(req.body)

        if (req.session.isLogin) {
            switch (req.body.action) {
                case "deleted":
                    break;
                case "buy":
                    var ObjectId = require("mongodb").ObjectId;
                    var ids = req.body.checkboxItem;
                    var oids = [];
                    ids.forEach(function (item) {
                        oids.push(new ObjectId(item));
                    });
                    req.session.idOrder = oids;
                    const queryBooks = Books.find({
                        _id: {
                            $in: oids
                        }
                    });
                    const queryCustomer = Accounts.findOne({
                        _id: ObjectId(req.session.idUser)
                    });
                    const queryPayments = Payments.find({});
                    Promise.all([queryBooks, queryCustomer, queryPayments])
                        .then(([books, customer, payments]) =>
                            res.render("./client/me/checkout", {
                                books: multipleMongooseToObject(books),
                                customer: mongooseToObject(customer),
                                payments: multipleMongooseToObject(payments),
                                title: "Đặt hàng",
                                userName: req.session.userName,
                            })
                        )
                        .catch(next);

                    break;
                default:
                    break;
            }
        } else {
            res.redirect("/tai-khoan/dang-nhap");
        }
    }
    //[POST] /sendMail
    sendMail(req, res, next) {
        var transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "hientranvan27@gmail.com",
                pass: "VanHien2001",
            },
        });

        var mailOptions = {
            from: req.body.email,
            to: "hientranvan27@gmail.com",
            subject: req.body.subject,
            text: req.body.message,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
        res.redirect("back");
    }
    //[GET]
    message(req, res, next) {
        res.render("./client/me/message");
    }
}

module.exports = new MeController();