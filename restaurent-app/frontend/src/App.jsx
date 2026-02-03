import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

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
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;