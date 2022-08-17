const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

const mongooseDelete = require('mongoose-delete');
// mongoose.plugin
const categories = new Schema({
   name: {type: String, default: ""},
   description: {type: String, default: ""},
   slug: {type: String, slug: 'name', unique: true},
},{
    timestamps: true
});
// Add plugs
mongoose.plugin(slug);
categories.plugin(mongooseDelete, {
    deletedAt : true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('categories', categories);