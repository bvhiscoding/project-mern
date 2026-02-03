import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import MainLayout from './components/layouts/MainLayout';
import AdminShell from './components/admin/AdminShell';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminDishesPage from './pages/admin/AdminDishesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes with MainLayout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/restaurants"
          element={
            <PrivateRoute>
              <MainLayout>
                <RestaurantsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/restaurants/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <RestaurantDetailPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <MainLayout>
                <CartPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <MainLayout>
                <CheckoutPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MainLayout>
                <OrdersPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <OrderDetailPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminShell />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="restaurants" element={<AdminRestaurantsPage />} />
            <Route path="dishes" element={<AdminDishesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
