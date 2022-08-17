const slug = require("slug");
const session = require("express-session");
const nodemailer = require("nodemailer");
const Books = require("../../models/books");
const Categories = require("../../models/categories");
const {
    mongooseToObject
} = require("../../../util/mongoose");
const {
    multipleMongooseToObject
} = require("../../../util/mongoose");
const Suppliers = require("../../models/suppliers");
const Accounts = require("../../models/accounts");
const Order = require("../../models/orders");
const mongoose = require("mongoose");
const XLSX = require("xlsx");

class BooksController {
    // [GET] /books/create
    create(req, res, next) {
        Categories.find({}).then(
            (categories) =>
            res.render("./books/create", {
                categories: multipleMongooseToObject(categories),
            })
            // .catch(next)
        );
    }
    // [GET] /books/show
    show(req, res, next) {
        if (req.session.login) {
            return res.status(200).json({
                status: "success",
                session: req.session.login
            });
        } else {
            res.status(200).json({
                status: "error",
                session: "No session"
            });
        }
    }
    // [POST] /books/stored
    stored(req, res, next) {
        const formData = req.body;

        formData.image = slug(req.body.name + req.body.author) + req.file.originalname;
        const book = new Books(req.body);
        var mailList = [];
        //Find Email and user name account
        Accounts.find({}, {
            email: 1,
            fullName: 1,
            _id: 0
        }).then((account) => {
            for (var i = 0; i < account.length; i++) {
                mailList.push(account[i]);
            }
        });

        //Send email multiple email user when after 5s query email
        setTimeout(function () {
            var transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "hientranvan27@gmail.com",
                    pass: "VanHien2001",
                },
            });

            mailList.forEach((item) => {
                var mailOptions = {
                    from: "hientranvan27@gmail.com",
                    to: item.email,
                    subject: `Bản tin quảng cáo sách mới "${req.body.name}`,
                    html: `<p>Xin chào khách hàng: ${item.fullName}</p>
                            <p>Chúng tôi giới thiệu đến bạn sản phẩm mới</p>
                            <h2>THÔNG TIN SẢN PHẨM</h2>
                            <p>Tên sách: ${req.body.name}</p>
                            <p>Tác giả: ${req.body.author}</p>
                            <p>Giá bán: ${req.body.price}</p>
                            <p>${req.body.description}</p>
                    `,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(item.fullName + item.email);
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                        console.log(`fullName: ${item.fullName} Email: ${item.email}`);
                    }
                });
            });
            //Save book
            book.save()
                .then(() => res.redirect("/trang-quan-li/me/cua-hang/sach"))
                .catch(next);
        }, 5000);
        //
    }

    // [GET] /books/:id/edit
    edit(req, res, next) {
        Promise.all([Books.findById(req.params.id), Categories.find()])
            .then(([book, categories]) => {
                res.render("./books/edit", {
                    book: mongooseToObject(book),
                    categories: multipleMongooseToObject(categories),
                });
            })
            .catch(next);
    }
    // [POST] /books/update
    update(req, res, next) {
        Books.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect("/trang-quan-li/me/cua-hang/sach"))
            .catch(next);
    }
    // [POST /books/:id/update-status
    updateStatus(req, res, next) {
        if (req.query.status === "true") {
            Books.updateOne({
                    _id: req.params.id
                }, {
                    $set: {
                        status: false
                    }
                })
                .then(() => res.redirect("back"))
                .catch(next);
        } else {
            Books.updateOne({
                    _id: req.params.id
                }, {
                    $set: {
                        status: true
                    }
                })
                .then(() => res.redirect("back"))
                .catch(next);
        }
    }
    // [POST] /books/:id
    destroy(req, res, next) {
        Books.delete({
                _id: req.params.id
            })
            .then(() => res.redirect("back"))
            .catch(next);
    }
    // [DELETE] /books/:id
    delete(req, res, next) {
        Books.delete({
                _id: req.params.id
            })
            .then(() => res.redirect("back"))
            .catch(next);
    }
    // [DELETE] /books/:id/force
    forceDelete(req, res, next) {
        Books.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect("back"))
            .catch(next);
    }
    // [POST] /books/:id/restored
    restored(req, res, next) {
        Books.restore({
                _id: mongoose.Types.ObjectId(req.params.id)
            })
            .then(() => res.redirect("back"))
            .catch(next);
    }
    // [POST] books/handFormAction
    handFormAction(req, res, next) {
        switch (req.body.action) {
            case "deleted":
                Books.delete({
                        _id: {
                            $in: req.body.checkboxItem
                        }
                    })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case "restored":
                Books.restore({
                        _id: {
                            $in: req.body.checkboxItem
                        }
                    })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case "deletedForce":
                Books.deleteMany({
                        _id: {
                            $in: req.body.checkboxItem
                        }
                    })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case "status-true":
                Books.updateMany({
                        _id: {
                            $in: req.body.checkboxItem
                        }
                    }, {
                        $set: {
                            status: true
                        }
                    })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case "status-false":
                Books.updateMany({
                        _id: {
                            $in: req.body.checkboxItem
                        }
                    }, {
                        $set: {
                            status: false
                        }
                    })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case "add":
                let nameSupplier = req.session.nameSupplier;
                Books.find({
                        _id: {
                            $in: req.body.checkboxItem
                        }
                    })
                    .then((products) =>
                        res.render("./books/confirmOrder", {
                            nameSupplier,
                            products: multipleMongooseToObject(products),
                        })
                    )
                    .catch(next);
                break;
            default:
                res.json({
                    message: "Action is invalid"
                });
                break;
        }
    }
    //[GET] /manager/me/books/order
    order(req, res, next) {
        const querySuppliers = Suppliers.find({}, {
            name: 1,
            _id: 0
        });
        const queryBooks = Books.find({}, {
            descriptionShort: 0,
            description: 0,
            type: 0,
            author: 0,
            reviews: 0
        });
        Promise.all([querySuppliers, queryBooks])
            .then(([suppliers, result]) => {
                res.render("./books/order", {
                    suppliers: multipleMongooseToObject(suppliers),
                    result: multipleMongooseToObject(result),
                });
            })
            .catch(next);
    }
    //[POST] /manager/me/books/nha-cung-cap
    suppliers(req, res, next) {
        const listType = [];
        Suppliers.find({
                name: req.body.name
            }, {
                _id: 0,
                type: 1
            })
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    result[i].type.forEach((type) => {
                        listType.push(type);
                    });
                }
                req.session.nameSupplier = req.body.name;
            })
            .catch(next);
        setTimeout(() => {
            Books.find({
                    type: listType
                })
                .then((result) =>
                    res.render("./books/order", {
                        result: multipleMongooseToObject(result),
                    })
                )
                .catch(next);
            // res.redirect('back')
        }, 5000);
    }
    //[POST] /manager/books/test
    test(req, res, next) {
        // res.json(req.body)
        console.log(req.body)
        let products = [];
        let product = {};
        let order = {};
        let supplier = {};
        let employee = {};
        const bodyForm = req.body;

        for (let i = 0; i < bodyForm.checkboxItem.length; i++) {
            Books.find({
                _id: {
                    $in: mongoose.Types.ObjectId(bodyForm.checkboxItem[i])
                }
            }).then((bookItem) => {
                bookItem.forEach((element, index) => {
                    product = {
                        id: element._id,
                        name: element.name,
                        quantity: bodyForm.quantity[i],
                        price: element.price,
                        totalPrice: parseFloat(element.price) * parseInt(bodyForm.quantity[i]),
                    };
                    products.push(product);
                });
            });
        }
        setTimeout(() => {
            supplier = {
                name: req.session.nameSupplier,
            };
            if (req.session.userName) {
                employee = {
                    name: req.session.userName,
                };
            }
            order = {
                supplier: supplier,
                products: products,
                employee: employee,
                addressDelivery: req.body.addressDelivery,
                dateOrder: req.body.dateOrder,
                dateDelivery: req.body.dateDelivery,
            };
            //save order
            const orderSave = new Order(order);
            orderSave.save();
            console.log("Successfully");
        }, 2500);
    }
    //[POST] //manager/books/ket-qua-dat-hang
    resultOrder(req, res, next) {
        let products = [];
        let totalPrice = 0;
        let dateDelivery = 0;

        Order.find({})
            .sort({
                createdAt: -1
            })
            .limit(1)
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    products = result[i].products;
                    dateDelivery = result[i].dateDelivery;
                }
                setTimeout(() => {
                    products.forEach((product) => {
                        totalPrice += product.totalPrice;
                    });
                    res.render("./books/resultOrder", {
                        nameSupplier: req.session.nameSupplier,
                        userName: req.session.userName,
                        quantity: products.length,
                        totalPrice: totalPrice,
                        dateDelivery: dateDelivery,
                        _id: result[0]._id,
                        products: multipleMongooseToObject(products),
                    });
                }, 2500);
            })
            .catch(next);
    }
    exportByExcel(req, res, next) {
        let products = [];
        let documents = [];
        Order.find({})
            .sort({
                createdAt: -1
            })
            .limit(1)
            .then((result) => {
                documents = result;
                for (let i = 0; i < result.length; i++) {
                    products = result[i].products;
                }
            })
            .catch(next);
        setTimeout(() => {
            const wb = XLSX.utils.book_new();
            let productList = JSON.stringify(products);
            productList = JSON.parse(productList);

            let document = JSON.stringify(documents);
            document = JSON.parse(document);

            const ws_item = XLSX.utils.json_to_sheet(productList);
            const ws_main = XLSX.utils.json_to_sheet(document);
            XLSX.utils.book_append_sheet(wb, ws_main, "ChungTu");
            XLSX.utils.book_append_sheet(wb, ws_item, "SanPham");
            const down = `${Date.now()}_chung_tu_dat_hang.xlsx`;
            XLSX.writeFile(wb, down);
            res.redirect("back");
        }, 2000);
    }
    //[GET] /manager/books/order?idDocs
    readOrderDocuments(req, res, next) {
        let totalPrice = 0;

        Order.findById(req.query.idDocs)
            .then((result) => {
                if (result) {
                    result.products.forEach(item => {
                            totalPrice += (item.price * item.quantity);
                        }),
                        res.render("./books/importGoods", {
                            nameSupplier: result.supplier.name,
                            userName: result.employee.name,
                            dateDelivery: result.dateDelivery,
                            _id: result._id,
                            quantity: result.products.length,
                            totalPrice,
                            products: multipleMongooseToObject(result.products)
                        });
                } else {
                    res.json({
                        message: "Không tìm thấy đơn đặt hàng"
                    });
                }
            })
            .catch(next);
    }
    //[GET] /trang-quan-li/sach/:id/don-hang
    importGoods(req, res, next) {
        const bodyForm = req.body;

        for (let i = 0; i < bodyForm.checkboxItem.length; i++) {
            console.log(bodyForm.checkboxItem[i])
            Books.find({
                    _id: mongoose.Types.ObjectId(bodyForm.checkboxItem[i])
                })
                .then(book => {
                    book.forEach(item => {
                        item.quantityStock += parseInt(bodyForm.quantity[i])
                        item.save();
                    })
                    res.redirect('http://localhost:3000/trang-quan-li/me/cua-hang/sach')
                })
                .catch(next)
        }
    }
}

module.exports = new BooksController();