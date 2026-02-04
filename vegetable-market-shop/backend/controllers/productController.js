const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async(req,res) =>{
    try {
         const pageSize = 10;
         const page = Number(req.query.pageNumber) || 1;
         const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
         } : {};
         const typeFilter = req.query.type ? { type: req.query.type } : {};
         const filters = { ...keyword, ...typeFilter };
         const count = await Product.countDocuments(filters);
         const products = await Product.find(filters)
         .limit(pageSize)
            .skip(pageSize * (page - 1));
            res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const getProductById = asyncHandler(async(req,res) =>{
    try {
        const product = await Product.findById(req.params.id);  
        if(product){
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const createProduct = asyncHandler(async(req,res) =>{
    try {
        const { name, type, price, description, countInStock, image } = req.body;
        const product = new Product({
            name,
            type,
            price,
            description,
            countInStock,
            image,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const updateProduct = asyncHandler(async(req,res) =>{
    try {
        const { name, type, price, description, countInStock, image } = req.body;   
        const product = await Product.findById(req.params.id);
        if(product){
            product.name = name || product.name;    
            product.type = type || product.type;
            product.price = price || product.price;
            product.description = description || product.description;
            product.countInStock = countInStock || product.countInStock;    
            product.image = image || product.image;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const deleteProduct = asyncHandler(async(req,res) =>{
    try {
        const product = await Product.findById(req.params.id);  
        if(product){
            await product.remove();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
}
