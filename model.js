const mongoose = require('mongoose');


const products = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    weight: {
        type: String,
        required: true,
    },

    price: {
        type: String,
        required: true,
        default: '0'
    },

    transaction:{
        type: String,
        enum: ['new_stock', 'sell'],
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
})






const Products = mongoose.model('products', products , 'products');



module.exports = {
    Products
};