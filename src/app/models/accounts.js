const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
// const slug = require('mong')
const mongooseDelete = require('mongoose-delete');
// mongoose.plugin
const accounts = new Schema({
    fullName: {type: String},
    email: {type: String},
    phoneNumber: {type: String},
    password: {type: String},
    type: {type: Number, default: 1},
    address: {type: String, default: ""},
    cart: {
        products: [{
            id: {type: Object},
            name: {type: String},
            price: {type: String},
            quantity: {type: Number},
            image: {type: String},
            status: {type: Boolean, default: false},
            createdAt: {type: Date, default: Date.now()}
        }]
    },
    order: [{
        address: {type: String, default: ""},
        products: [{
            id: {type: Object},
            name: {type: String},
            image: {type: String},
            price: { type: Number },
            quantity: { type: Number, default: 1 },
            createdAt: { type: Date, default: Date.now() },
            status: { type: Boolean, default: false }, 
        }],
        payment: {
            // id: { type: Object },
            name: { type: String },
            status: { type: Boolean, default: false },
        },
        createdAt: {type: Date, default: Date.now()},
        status: {type: Boolean, default: false}
    }],
    historyLogin: {type: Date, default: Date.Now}
},{
    timestamps: true
});
// Add plugs
mongoose.plugin(slug);
accounts.plugin(mongooseDelete, {
    deletedAt : true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('accounts', accounts);