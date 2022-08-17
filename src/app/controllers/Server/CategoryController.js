const Categories = require('../../models/categories');

class CategoryController {
    // [GET] /manager/category/create
    create(req, res, next) {
        res.render('category/create')
    }
    // [POST] /manager/category/add-category
    addCategory(req, res, next) {
        const categories = new Categories(req.body);
        categories.save()
            .then(() => res.redirect('back'))
            .catch(next)
    }
}

module.exports = new CategoryController;