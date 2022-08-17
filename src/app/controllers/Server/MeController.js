
const Books = require('../../models/books');
const { mongooseToObject } = require('../../../util/mongoose');
const { multipleMongooseToObject } = require('../../../util/mongoose');
const slug = require('slug');

const PaginatedResults = require('../../middlewares/PageNumberMiddleware');

class MeController {
    // [GET] /me/stored/book
    stored(req, res, next) {
        let booksQuery = Books.find({});
        if(req.query.hasOwnProperty('_sort')) {
            booksQuery = booksQuery.sort({
                [req.query.column]: req.query.type
            })
        }
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit; //Bắt đầu lấy từ đâu
        const endIndex = page * limit; // Bỏ qua N docs

        const result = {};
        if(endIndex < Books.countDocuments()) {
            result.next = {
                page: page + 1,
                limit: limit
            };
        }

        if(startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            };
        }

        Promise.all([booksQuery.limit(5).skip(startIndex), Books.countDocuments()])
            .then(([books, countBooks, pageNumber]) => {
                res.render('./me/stored-books', {
                    countBooks,
                    pageNumber: Math.ceil(countBooks / 5) + 1,
                    books: multipleMongooseToObject(books)
                })
            })
            .catch(next);
    }
    // [GET] /me/trash/book
    trash(req, res, next) {
        const booksQuery = Books.findDeleted({});
        Promise.all([booksQuery, Books.countDocumentsDeleted()])
            .then(([books, deleteCount]) => {
                res.render('./me/trash-books', {
                    deleteCount,
                    books: multipleMongooseToObject(books)
                })
            })
            .catch(next);
    }
}

module.exports = new MeController;