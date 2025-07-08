const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const {Products} = require("./model");

require("dotenv").config()


mongoose.connect(process.env.MONGO_URI).then(() => console.log('mongodb connected!'));



// Middlewares
app.use(express.json());
app.use(cors());


// Basic route
app.post('/api/products', async (req, res) => {
    const {type,weight,price} = req.body;

    const product = new Products({
        type,
        weight,
        price
    });

    await product.save()

    const RiceProduct = await Products.findOne({type: 'Rice' && transaction === 'buy'});
    const SugarProduct = await Products.findOne({type: 'sugar' && transaction === 'buy'});


    if(type === 'Rice') {
        RiceProduct.weight -= weight;
        await RiceProduct.save();
    }
    else if(type === 'sugar') {
        SugarProduct.weight -= weight;
        await SugarProduct.save();
    }

    return res.json(product)
});


app.get('/api/products', async (req, res) => {
    const products = await Products.find();

    const totalWeightForRice = products
    .filter(p => p.transaction === 'buy' && p.type === 'Rice')
    .reduce((sum, p) => sum + p.weight, 0);

  const totalWeightForSugar = products
    .filter(p => p.transaction === 'buy' && p.type === 'sugar')
    .reduce((sum, p) => sum + p.weight, 0);

  const totalRevenueForRice = products
    .filter(p => p.transaction === 'sell' && p.type === 'Rice')
    .reduce((sum, p) => sum + parseFloat(p.price), 0);

  const totalRevenueForSugar = products
    .filter(p => p.transaction === 'sell' && p.type === 'sugar')
    .reduce((sum, p) => sum + parseFloat(p.price), 0);

    return res.json({
        "totalWeightForRice": totalWeightForRice,
        "totalWeightForSugar": totalWeightForSugar,
        "totalRevenueForRice": totalRevenueForRice,
        "totalRevenueForSugar": totalRevenueForSugar,
        "products": products
    });
});



app.get('/api/products/:id', async (req, res) => {
    const product = await Products.find({_id: req.params.id});

    return res.json(product);
});




app.put('/api/products/:id', async (req, res) => {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {new: true});
    return res.json(product);
});




// Start server
app.listen(3000, () => {
    console.log(`Server is  3000`);
});