const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
// const slug = require('mong')
const mongooseDelete = require('mongoose-delete');
// mongoose.plugin
const books = new Schema({
    name: {type: String, default: "Not name ?"},
    descriptionShort: {type: String, default: ""},
    description: {type: String, default: ""},
    type: {type: String, default: "thieu-nhi"},
    author: {type: String, default: ""},
    price: {type: Number, default: 0},
    image: {type: String, default: ""},
    status: {type: Boolean, default: true},
    quantityStock: {type: Number, default: 0},
    quantitySell: {type: Number, default: 0},
    quantityView: {type: Number, default: 0},
    reviews: [{
        name: {type: String, default: "Giấu tên"},
        email: {type: String, default: "Không hiển thị"},
        reviewText: {type: String, default: ""},
        star: {type: Number, default: 0},
        createdAt: {type: Date, default: Date.now()}
    }],
    slug: {type: String, slug: 'name', unique: true},

},{
    timestamps: true
});
// Add plugs
mongoose.plugin(slug);
books.plugin(mongooseDelete, {
    deletedAt : true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('books', books);