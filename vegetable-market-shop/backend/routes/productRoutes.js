const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

// @route   GET /api/products
router.get('/', getProducts);

// @route   GET /api/products/:id
router.get('/:id', getProductById);

// @route   POST /api/products
router.post('/', protect, admin, createProduct);
// @route   PUT /api/products/:id
router.put('/:id', protect, admin, updateProduct);
// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
