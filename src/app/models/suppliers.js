const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;
// mongoose.plugin
const suppliers = new Schema({
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    address: {type: String},
    type: [{type: String}],
    status: {type: Boolean, default: true}
},{
    timestamps: true
});
// Add plugs
mongoose.plugin(slug);
suppliers.plugin(mongooseDelete, {
    deletedAt : true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('suppliers', suppliers);