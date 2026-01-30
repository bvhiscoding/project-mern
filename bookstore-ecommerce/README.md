# Bookstore E-commerce (MERN)

Full-stack bookstore with authentication, cart, orders, and admin management.

## Tech Stack
- Frontend: React (Vite), Redux Toolkit, Tailwind CSS v4, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT

## Environment Setup

Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=change_this_secret
SEED_BOOKS=false
CLIENT_URL=http://localhost:5173
```

Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

Examples are in:
- `backend/.env.example`
- `frontend/.env.example`

## Run Locally

Backend
```
cd backend
npm install
npm run dev
```

Frontend
```
cd frontend
npm install
npm run dev
```

## Seed Accounts
If the database is empty, the server seeds demo users/books on start.

- Admin: `admin@bookstore.dev` / `Admin123!`
- User: `user@bookstore.dev` / `User123!`

To force reseed, set `SEED_BOOKS=true` and restart the backend.

## Project Structure
```
bookstore-ecommerce/
├── backend/
└── frontend/
```

## Notes
- Frontend uses lazy-loaded routes for faster initial load.
- Cart and auth are persisted in localStorage.
