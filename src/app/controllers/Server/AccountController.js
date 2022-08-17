const session = require("express-session");
const Accounts = require("../../models/accounts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class AccountController {
    // [GET] /tai-khoan/dang-nhap
    login(req, res, next) {
        res.render("account/login");
    }
    // [POST] /tai-khoan/dang-nhap
    checkLogin(req, res, next) {
        var userName = req.body.userName;
        var password = req.body.password;
        Accounts.findOne({ $and: [{ type: 1 }, { $or: [{ email: userName }, { phoneNumber: userName }] }] }).then((account) => {
            if (account) {
                bcrypt.compare(password, account.password, function (err, result) {
                    if (err) {
                        res.json({ error: err });
                    }
                    if (result) {
                        let token = jwt.sign({ name: userName }, "verySecretValue", { expiresIn: "1h" });
                        req.session.isLogin = true;
                        req.session.userName = account.fullName;
                        const today = new Date();
                        var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        var dateTime = date + " " + time;
                        account.historyLogin = dateTime;
                        account.save();
                        res.redirect("/trang-quan-li/admin/content-analysis");
                    } else {
                        res.render("account/login", {
                            notify: "Mật khẩu không chính xác",
                        });
                    }
                });
            } else {
                res.render("account/login", {
                    notify: "Tài khoản hoặc mật khẩu không chính xác",
                });
            }
        });
    }
    // [GET] /tai-khoan/dang-ki
    register(req, res, next) {
        res.render("account/register");
    }
    // [POST] /tai-khoan/dang-ki
    addAccount(req, res, next) {
        Accounts.findOne({ $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }] })
            .then((result) => {
                if (result) {
                    res.render("account/register", {
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
                            account.type = 1;
                            account
                                .save()
                                .then(() => res.redirect("/trang-quan-li/tai-khoan/dang-nhap"))
                                .catch(next);
                        });
                    });
                }
            })
            .catch(next);
    }
    logout(req, res, next) {
        req.session.destroy((err) => {
            res.redirect("/trang-quan-li/tai-khoan/dang-nhap");
        });
    }
}

module.exports = new AccountController();
