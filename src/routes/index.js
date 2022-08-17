const booksRoute = require("../routes/book");
const searchRoute = require("../routes/search");
const meRoute = require("../routes/me");
const accountRoute = require("../routes/account");
const adminRoute = require("../routes/admin");
const categoryRoute = require("../routes/category");
const meClientRoute = require("../routes/client/meRoute");
const productClientRoute = require("../routes/client/productRoute");
const accountClientRoute = require("../routes/client/accountRoute");
const apiRoute = require("../routes/API/APIRoute");
const reviewRoute = require("../routes/client/reviewRoute");

function route(app) {
    app.use("/trang-quan-li/tai-khoan", accountRoute);
    app.use("/trang-quan-li/admin", adminRoute);
    app.use("/search", searchRoute);
    app.use("/trang-quan-li/sach", booksRoute);
    app.use("/trang-quan-li/me", meRoute);
    app.use("/trang-quan-li/the-loai", categoryRoute);
    app.use("/tai-khoan", accountClientRoute);
    app.use("/san-pham", productClientRoute);
    app.use("/api", apiRoute);
    app.use("/danh-gia", reviewRoute);
    app.use("/", meClientRoute);
}

module.exports = route;
