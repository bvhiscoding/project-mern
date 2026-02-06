import { Navigate, Outlet, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function ProtectedRoute() {
  const { user, token } = useSelector((state) => state.auth);
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function AdminRoute() {
  const { user } = useSelector((state) => state.auth);
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/create" element={<AdminProductFormPage />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
