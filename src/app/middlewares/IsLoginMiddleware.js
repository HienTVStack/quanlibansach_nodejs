const isLogin = function(req, res, next) {
    if(req.session.isLogin) {
        next()
    }
    else {
        res.redirect('/trang-quan-li/tai-khoan/dang-nhap');
    }
}

module.exports = isLogin;
