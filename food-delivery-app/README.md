# Food Delivery App - MERN Stack

## ✅ Phase 1 + 2 COMPLETED!

### 📁 Project Structure
```
food-delivery-app/
├── backend/
│   ├── config/
│   │   └── db.js              ✅ MongoDB connection
│   ├── models/
│   │   ├── User.js            ✅ User model with bcrypt
│   │   ├── Restaurant.js      ✅ Restaurant + Dish models
│   │   └── Order.js           ✅ Order model with refs
│   ├── utils/
│   │   └── seedData.js        ✅ Seed 5 restaurants
│   ├── .env                   ✅ Environment variables
│   └── package.json           ✅ All dependencies installed
│
├── frontend/
│   ├── src/
│   │   └── index.css          ✅ Minimal reset CSS
│   ├── .env                   ✅ API URL configured
│   ├── tailwind.config.js     ✅ Ready for Phase 13
│   └── package.json           ✅ All dependencies installed
│
├── postman/                   ✅ Ready for Phase 5
├── .gitignore                 ✅ Git configured
└── README.md                  ✅ This file
```

---

## 📦 Installed Packages

### Backend
- ✅ express - Web framework
- ✅ mongoose - MongoDB ODM
- ✅ dotenv - Environment variables
- ✅ cors - Cross-Origin Resource Sharing
- ✅ bcryptjs - Password hashing
- ✅ jsonwebtoken - JWT authentication
- ✅ express-validator - Input validation
- ✅ helmet - Security headers
- ✅ express-rate-limit - Rate limiting
- ✅ morgan - HTTP logger
- ✅ nodemon (dev) - Auto-restart

### Frontend
- ✅ react + vite - UI library + build tool
- ✅ react-router-dom - Routing
- ✅ @reduxjs/toolkit + react-redux - State management
- ✅ axios - HTTP client
- ✅ react-hook-form + yup - Form handling & validation
- ✅ react-toastify - Notifications
- ✅ tailwindcss - CSS framework (prepared for Phase 13)

---

## 🚀 Next Steps

### How to Run:

**Backend:**
```bash
cd backend

# 1. Make sure MongoDB is running locally OR
#    Update MONGODB_URI in .env to MongoDB Atlas connection string

# 2. Seed the database
npm run seed

# 3. Start backend server
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🎯 What's Ready:

✅ **Phase 1: Project Setup**
- Project structure created
- Git initialized
- Backend dependencies installed
- Frontend dependencies installed
- Environment variables configured
- Tailwind CSS prepared (not activated yet)

✅ **Phase 2: Database & Models**
- MongoDB connection ready
- User model with password hashing
- Restaurant model with embedded dishes
- Order model with references
- Seed data with 5 restaurants

---

## 📝 Environment Variables

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-delivery-app
JWT_SECRET=your_jwt_secret_here_change_me_123456789_super_secret
JWT_REFRESH_SECRET=your_refresh_secret_here_change_me_987654321_super_secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🔜 Ready for Phase 3!

Next up: **Middleware & Utilities**
- Error handling
- JWT token generation
- Authentication middleware
- Authorization middleware
- Validation middleware

---

**Created:** 2024
**Status:** Phase 1 + 2 Complete ✅
**Next:** Phase 3 - Middleware & Utilities
