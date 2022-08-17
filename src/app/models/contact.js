const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const contact = new Schema({
    email: {type: String, default: 'info@gmail.com'},
    phoneNumber: {type: String, default: '01234567890'},
    address: {type: String, default: '140 Lê Trọng Tấn, phường Tây Thạnh, quận Tân Phú'},
    description: {type: String},
    nameStore: {type: String,},
    main: {type: Boolean, default: false},
    status: {type: Boolean, default: true}
}, {
    timestamps: true
});

mongoose.plugin(slug);
contact.plugin(mongooseDelete, {
    deletedAt : true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('contact', contact);