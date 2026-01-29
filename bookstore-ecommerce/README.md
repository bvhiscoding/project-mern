# 📚 BOOKSTORE E-COMMERCE - MERN Stack Project

Full-stack E-commerce Bookstore với đầy đủ tính năng: quản lý sách, giỏ hàng, thanh toán, quản lý đơn hàng, authentication và admin panel.

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password hashing)
- express-validator

### Frontend
- React (Vite)
- Redux Toolkit (State Management)
- React Router DOM (Routing)
- Tailwind CSS v4 (Styling)
- Axios (API calls)
- FontAwesome (Icons)

---

## ✅ PHASE 1: PROJECT SETUP & CONFIGURATION - COMPLETED

### Backend Setup ✅
- [x] Tạo thư mục `bookstore-ecommerce/backend`
- [x] Khởi tạo npm project (`npm init -y`)
- [x] Cài đặt dependencies:
  - [x] express, mongoose, cors, dotenv
  - [x] bcryptjs (hash passwords)
  - [x] jsonwebtoken (JWT authentication)
  - [x] express-validator (validation)
  - [x] nodemon (dev dependency)
- [x] Tạo cấu trúc thư mục backend:
  ```
  backend/
  ├── config/         # Database configuration
  ├── models/         # Mongoose schemas (User, Book, Order)
  ├── controllers/    # Business logic
  ├── routes/         # API endpoints
  ├── middlewares/    # Auth, Admin, Error middlewares
  ├── utils/          # Seed data, helpers
  └── .env            # Environment variables
  ```
- [x] Tạo file `.env` với: `PORT`, `MONGODB_URI`, `JWT_SECRET`
- [x] Tạo file `.gitignore` (node_modules, .env)
- [x] Cập nhật `package.json` scripts:
  - [x] `"start": "node server.js"`
  - [x] `"dev": "nodemon server.js"`

### Frontend Setup ✅
- [x] Tạo Vite React app: `npm create vite@latest frontend -- --template react`
- [x] Cài đặt dependencies:
  - [x] @reduxjs/toolkit, react-redux
  - [x] react-router-dom
  - [x] axios
  - [x] @fortawesome/react-fontawesome, @fortawesome/free-solid-svg-icons
- [x] Cài đặt và config Tailwind CSS v4:
  - [x] npm install -D tailwindcss postcss autoprefixer
  - [x] Tạo `tailwind.config.js` với custom theme
  - [x] Cập nhật `src/index.css` với `@import "tailwindcss";`
- [x] Tạo cấu trúc thư mục frontend:
  ```
  frontend/src/
  ├── components/       # Reusable components
  │   ├── Header.jsx
  │   ├── Footer.jsx
  │   ├── BookCard.jsx
  │   ├── BookList.jsx
  │   ├── Cart.jsx
  │   ├── CartItem.jsx
  │   ├── FilterBar.jsx
  │   ├── PrivateRoute.jsx
  │   ├── AdminRoute.jsx
  │   └── Loader.jsx
  ├── pages/           # Page components
  │   ├── HomePage.jsx
  │   ├── LoginPage.jsx
  │   ├── RegisterPage.jsx
  │   ├── BookDetailPage.jsx
  │   ├── CartPage.jsx
  │   ├── CheckoutPage.jsx
  │   ├── OrdersPage.jsx
  │   ├── OrderDetailPage.jsx
  │   ├── ProfilePage.jsx
  │   └── admin/
  │       ├── AdminBooksPage.jsx
  │       ├── AdminOrdersPage.jsx
  │       └── AdminUsersPage.jsx
  ├── redux/           # State management
  │   ├── store.js
  │   └── slices/
  │       ├── authSlice.js
  │       ├── bookSlice.js
  │       ├── cartSlice.js
  │       └── orderSlice.js
  └── services/        # API services
      ├── api.js
      ├── authService.js
      ├── bookService.js
      └── orderService.js
  ```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20.15.1+
- MongoDB installed and running
- npm v10.7.0+

### Backend Installation
```bash
cd backend
npm install
# Cập nhật file .env với MongoDB URI của bạn
npm run dev  # Development mode với nodemon
```

### Frontend Installation
```bash
cd frontend
npm install
npm run dev  # Starts Vite dev server on http://localhost:5173
```

---

## 📝 Next Steps - PHASE 2

### Database Models (Backend)
- [ ] User Model (`models/User.js`)
  - [ ] Schema với name, email, password, isAdmin
  - [ ] Pre-save hook để hash password
  - [ ] Method `matchPassword()` để verify password
  
- [ ] Book Model (`models/Book.js`)
  - [ ] Schema với title, author, genre, description, price, image, stock, rating
  
- [ ] Order Model (`models/Order.js`)
  - [ ] Schema với user, orderItems, shippingAddress, paymentMethod, prices

---

## 📁 Project Structure

```
bookstore-ecommerce/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js (to be created)
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── redux/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🎯 Project Features (Planned)

✅ **Phase 1 Complete:**
- Project setup & configuration
- Dependencies installed
- Folder structure created
- Tailwind CSS v4 configured

🔜 **Coming Next:**
- Phase 2: Database Models
- Phase 3: Backend Utilities & Middlewares
- Phase 4: Backend Controllers
- Phase 5: Backend Routes
- Phase 6: Backend Server Setup
- Phase 7-13: Frontend Implementation
- Phase 14-18: Testing, Optimization & Deployment

---

## 📚 Documentation

- [AGENTS.md](../../AGENTS.md) - Coding guidelines and conventions
- [Project Plan](../../plans/bookstore-ecommerce.md) - Detailed 18-phase implementation plan

---

## 👨‍💻 Author

Created following MERN stack best practices and AGENTS.md conventions.

---

## 📄 License

This project is for educational purposes.
