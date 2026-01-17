const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

// Import routes
const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchListRoutes');
const connectDB= require('./config/db')
const app = express()
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());

connectDB()
// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Stock Market Portfolio API',
    endpoints: {
      stocks: '/api/stocks',
      watchlist: '/api/watchlist'
    }
  });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port `);
  console.log(`API available at http://localhost:`);
});
