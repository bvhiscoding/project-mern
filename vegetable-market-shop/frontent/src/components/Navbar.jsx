import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { itemsCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🥬 Veg Market
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/cart" className="cart-link">
              🛒 Cart
              {itemsCount > 0 && (
                <span className="cart-badge">{itemsCount}</span>
              )}
            </Link>
          </li>

          {user ? (
            <li className="user-dropdown">
              <button className="user-button">
                👤 {user.name}
              </button>
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/orders">My Orders</Link>
                {user.role === 'admin' && (
                  <>
                    <div className="dropdown-divider"></div>
                    <Link to="/admin/products">Manage Products</Link>
                    <Link to="/admin/orders">Manage Orders</Link>
                  </>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <li>
              <Link to="/login" className="login-btn">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
