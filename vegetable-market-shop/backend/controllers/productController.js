const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page || req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const typeFilter = req.query.type ? { type: req.query.type } : {};
  const filters = { ...keyword, ...typeFilter };

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    price,
    description,
    image,
    stock,
    category,
    unit,
    featured,
  } = req.body;

  const product = await Product.create({
    name,
    type,
    price,
    description,
    image,
    stock: Number(stock ?? 0),
    category: category || 'General',
    unit: unit || 'kg',
    featured: Boolean(featured),
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name,
    type,
    price,
    description,
    image,
    stock,
    category,
    unit,
    featured,
  } = req.body;

  product.name = name ?? product.name;
  product.type = type ?? product.type;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  product.image = image ?? product.image;
  product.stock = stock ?? product.stock;
  product.category = category ?? product.category;
  product.unit = unit ?? product.unit;
  product.featured = featured ?? product.featured;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
