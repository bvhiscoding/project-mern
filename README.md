# MERN Stack Practice Projects

A collection of practice projects built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

## Projects

### 1. Stock Market Portfolio

A full-stack web application for tracking stocks and managing a personal watchlist.

**Features:**
- Browse and search stocks
- Add/remove stocks to personal watchlist
- Real-time stock data display
- Responsive Material UI design

**Tech Stack:**

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Material UI, React Router, Axios |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/project-mern.git
cd project-mern
```

#### 2. Setup Stock Market Portfolio

**Backend:**

```bash
cd stock-market-portfolio/backend
npm install

# Create .env file with your MongoDB connection
# MONGODB_URI=your_mongodb_connection_string
# PORT=5000

npm run dev
```

**Frontend:**

```bash
cd stock-market-portfolio/frontend
npm install
npm start
```

The app will run at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## API Endpoints

### Stock Market Portfolio API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | Get all stocks |
| GET | `/api/watchlist` | Get user watchlist |
| POST | `/api/watchlist` | Add stock to watchlist |
| DELETE | `/api/watchlist/:id` | Remove from watchlist |

---

## Project Structure

```
project-mern/
├── README.md
├── stock-market-portfolio/
│   ├── backend/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── server.js       # Express server
│   │   └── package.json
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── pages/      # Page components
│       │   ├── services/   # API services
│       │   └── App.js
│       └── package.json
└── ... (more projects to be added)
```

---

## Contributing

Feel free to add more MERN practice projects to this collection!

## License

This project is for educational purposes.
