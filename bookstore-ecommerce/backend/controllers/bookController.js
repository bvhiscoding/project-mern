const Book = require('../models/Book')

const getBooks = async (req, res) => {
  try {
    const { genre, minPrice, maxPrice, sort } = req.query
    const query = {}

    if (genre) {
      query.genre = genre
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    let booksQuery = Book.find(query)

    if (sort === 'price') {
      booksQuery = booksQuery.sort({ price: 1 })
    }
    if (sort === '-price') {
      booksQuery = booksQuery.sort({ price: -1 })
    }

    const books = await booksQuery
    res.status(200).json(books)
  } catch (error) {
    console.error('GetBooks error:', error)
    res.status(500).json({ message: error.message })
  }
}

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
    res.status(200).json(book)
  } catch (error) {
    console.error('GetBookById error:', error)
    res.status(500).json({ message: error.message })
  }
}

const createBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, image, stock } = req.body

    if (!title || !author || !genre || !description || price == null || !image) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      price,
      image,
      stock: stock ?? 0,
    })

    res.status(201).json(book)
  } catch (error) {
    console.error('CreateBook error:', error)
    res.status(500).json({ message: error.message })
  }
}

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    Object.assign(book, req.body)
    const updatedBook = await book.save()
    res.status(200).json(updatedBook)
  } catch (error) {
    console.error('UpdateBook error:', error)
    res.status(500).json({ message: error.message })
  }
}

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    await book.deleteOne()
    res.status(200).json({ message: 'Book removed' })
  } catch (error) {
    console.error('DeleteBook error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
}
