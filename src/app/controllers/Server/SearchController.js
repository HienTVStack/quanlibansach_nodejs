const Books = require('../../models/books');
const { mongooseToObject } = require('../../../util/mongoose');
const { multipleMongooseToObject } = require('../../../util/mongoose');

class SearchController {

    index(req, res, next) {
        const keyword = req.query.keyword;

        Books.find({name: { $regex: keyword, $options: '$i' }})
            .then(books => res.render('./search/resulted', {
                books: multipleMongooseToObject(books)
            }))
            .catch(next);
    }
   
}

module.exports = new SearchController;