const Accounts = require("../../models/accounts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
class AccountController {
    //[GET] /account/login
    login(req, res, next) {
        res.render("client/account/login");
    }
    // [POST] /account/login
    checkLogin(req, res, next) {
        var userName = req.body.userName;
        var password = req.body.password;
        Accounts.findOne({$or: [{email: userName}, {phoneNumber: userName}]})
            .then(account => {
                if(account) {
                    bcrypt.compare(password, account.password, function(err, result) {
                        if(err) {res.json({error: err})}
                        if(result) {
                            let token = jwt.sign({name: userName}, 'verySecretValue', {expiresIn: '1h'})
                            req.session.isLogin = true;
                            req.session.userName = account.fullName;
                            req.session.idUser = account._id;
                            res.redirect("/shop");
                        }
                        else {
                            res.render("client/account/login", {
                                notify: "Mật khẩu không chính xác",
                            });
                        }
                    })
                }
                else {
                    res.render("client/account/login", {
                        notify: "Tài khoản hoặc mật khẩu không chính xác",
                    });
                }
            })
    }
    // [GET] /tai-khoan/dang-ki
    register(req, res, next) {
        res.render("client/account/register");
    }
    // [POST] /tai-khoan/dang-ki
    addAccount(req, res, next) {
        Accounts.findOne({ $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }] })
            .then((result) => {
                if (result) {
                    res.render("client/account/register", {
                        notify: "Email hoặc số điện thoại đã được sử dụng",
                    });
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(req.body.password, salt, function (err, hashPass) {
                            if (err) {
                                res.json({ error: err });
                            }
                            let account = new Accounts({
                                fullName: req.body.fullName,
                                email: req.body.email,
                                phoneNumber: req.body.phoneNumber,
                                password: hashPass,
                            });
                            account.type = 2;
                            account
                                .save()
                                .then(() => res.redirect("/tai-khoan/dang-nhap"))
                                .catch(next);
                        });
                    });
                }
            })
            .catch(next);
    }
    // [GET] /tai-khoan/dang-xuat
    logout(req, res, next) {
        req.session.destroy((err) => {
            res.redirect('/')
        })
    }
}

module.exports = new AccountController();
