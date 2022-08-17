const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
// const slug = require('mong')
const mongooseDelete = require('mongoose-delete');
// mongoose.plugin
const orders = new Schema({
    supplier: {
        id: {type: Object},
        name: {type: String, default: 'Không xác định'},
        address: {type: String, default: 'Chưa xác định'},
    },
    products: [{
        id: {type: Object},
        name: {type: String},
        quantity: {type: Number, default: 10},
        price: {type: Number},
        totalPrice: {type: Number},
    }],
    employee: {
        id: {type: Object},
        name: {type: String, default: 'Không xác định'},
    },
    addressDelivery: {type: String, default: 'Không xác định'},
    dateOrder:{ type: String, default: Date.now()},
    dateDelivery: {type: Date}
},{
    timestamps: true
});
// Add plugs
mongoose.plugin(slug);
orders.plugin(mongooseDelete, {
    deletedAt : true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('orders', orders);