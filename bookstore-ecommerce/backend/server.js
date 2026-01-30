const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/userRoutes')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const { seedBooks, seedUsers } = require('./utils/seedData')
const Book = require('./models/Book')
const User = require('./models/User')

dotenv.config()

const app = express()

app.use(express.json())
const corsOptions = process.env.CLIENT_URL
  ? { origin: process.env.CLIENT_URL }
  : undefined
app.use(cors(corsOptions))

// API
app.get('/', (req, res) => {
  res.json({ message: 'Bookstore API running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()

  const shouldSeed = process.env.SEED_BOOKS === 'true'
  if (shouldSeed) {
    await seedUsers()
    await seedBooks()
  } else {
    const [bookCount, userCount] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
    ])
    if (userCount === 0) {
      await seedUsers()
    }
    if (bookCount === 0) {
      await seedBooks()
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
