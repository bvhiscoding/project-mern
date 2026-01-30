const express = require('express')
const router = express.Router()

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController')
const { protect } = require('../middlewares/authMiddleware')
const { admin } = require('../middlewares/adminMiddleware')
const { validateRequest } = require('../middlewares/validationMiddleware')
const { body } = require('express-validator')

// Books API
router.get('/', getBooks)
router.get('/:id', getBookById)
router.post(
  '/',
  protect,
  admin,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a number'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a number'),
  validateRequest,
  createBook
)
router.put(
  '/:id',
  protect,
  admin,
  body('title').optional().trim().notEmpty().withMessage('Title is required'),
  body('author').optional().trim().notEmpty().withMessage('Author is required'),
  body('genre').optional().trim().notEmpty().withMessage('Genre is required'),
  body('description').optional().trim().notEmpty().withMessage('Description is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a number'),
  body('image').optional().trim().notEmpty().withMessage('Image URL is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a number'),
  validateRequest,
  updateBook
)
router.delete('/:id', protect, admin, deleteBook)

module.exports = router
