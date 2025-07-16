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
    try {
        const {type,weight,price,transaction} = req.body;
        console.log(req.body.weight);
    
        const product = new Products({
            type,
            weight,
            price,
            transaction
        });
    
        await product.save()
    
        const RiceProduct = await Products.findOne({
            type:   'Rice',        
            transaction: 'new_stock'     
        });
    
        const SugarProduct = await Products.findOne({
            type:   'Sugar',        
            transaction: 'new_stock'  
        });
    
    
        if(type === 'Rice' && transaction === 'sell') {
            RiceProduct.weight -= weight;
            await RiceProduct.save();
        }
        else if(type === 'Sugar' && transaction === 'sell') {
            SugarProduct.weight -= weight;
            await SugarProduct.save();
        }
    
        return res.json(product)

    } catch (error) {
        console.error('Error saving product:', error);
        return res.status(500).json(error);
    }
});


app.get('/api/products', async (req, res) => {
    const products = await Products.find();

    const totalWeightForRice = products
    .filter(p => p.transaction === 'new_stock' && p.type === 'Rice')
    .reduce((sum, p) => sum + p.weight, 0);

  const totalWeightForSugar = products
    .filter(p => p.transaction === 'new_stock' && p.type === 'Sugar')
    .reduce((sum, p) => sum + p.weight, 0);

  const totalRevenueForRice = products
    .filter(p => p.transaction === 'sell' && p.type === 'Rice')
    .reduce((sum, p) => sum + parseFloat(p.price), 0);

  const totalRevenueForSugar = products
    .filter(p => p.transaction === 'sell' && p.type === 'Sugar')
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