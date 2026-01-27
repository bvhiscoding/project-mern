import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from './pages/HomePage';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/profile/:id"
                element={
                  <div className="text-center text-2xl mt-10">
                    Profile Page - Coming Soon
                  </div>
                }
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="text-center text-2xl mt-10">404 Not Found</div>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
