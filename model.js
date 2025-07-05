const mongoose = require('mongoose');


const products = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    weight: {
        type: Number,
        required: true
    },

    price: {
        type: String,
        required: true,
        default: '0'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})






const Products = mongoose.model('products', products , 'products');



module.exports = {
    Products
};