const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
// const slug = require('mong')
const mongooseDelete = require('mongoose-delete');
// mongoose.plugin
const payments = new Schema({
    name: {type: String},
    slug: {type: String,slug: 'name', unique: true},
    description: {type: String, default: ""}
},{
    timestamps: true
});
// Add plugs
mongoose.plugin(slug);
payments.plugin(mongooseDelete, {
    deletedAt : true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('payments', payments);