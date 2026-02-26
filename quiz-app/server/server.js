const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

const connect = require('./database/conn');
const router = require('./router/route');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Quiz API is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    uptime: process.uptime()
  });
});

app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
