import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUtensils, FaTachometerAlt } from 'react-icons/fa';
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <nav className="sticky top-0 z-50 border-b border-[#eadfce] bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-none">
            <Link to="/" className="flex items-center space-x-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e0b8] text-[#8f3721]">
                <FaUtensils className="text-lg" />
              </span>
              <div className="leading-tight">
                <span className="text-xl font-bold text-[#2b1e18] font-display block">Foodeli App</span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#8f3721] font-semibold">Bistro guide</span>
              </div>
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-1">
            <Link
              to="/"
              className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition"
            >
              <FaTachometerAlt />
              Dashboard
            </Link>
            <Link
              to="/restaurants"
              className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] px-4 py-2 rounded-full text-sm font-semibold transition"
            >
              Restaurants
            </Link>
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center justify-end flex-none space-x-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] px-4 py-2 rounded-full text-sm font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#b1452a] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#8f3721] shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
            {user && (
              <>
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative text-[#3c2f2a] hover:text-[#8f3721]"
                >
                  <FaShoppingCart className="text-2xl" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#8f3721] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-[#3c2f2a] hover:text-[#8f3721]">
                    <FaUser className="text-2xl" />
                    <span className="text-sm font-semibold">{user.name}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-2 border border-[#eadfce] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-[#3c2f2a] hover:bg-[#fff4e6]"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-[#3c2f2a] hover:bg-[#fff4e6]"
                    >
                      Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-[#3c2f2a] hover:bg-[#fff4e6]"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#8f3721] hover:bg-[#fff4e6]"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#3c2f2a] hover:text-[#8f3721]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 border-t border-[#eadfce]">
          <div className="px-3 pt-3 pb-4 space-y-1 sm:px-4">
            <Link
              to="/"
              className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] block px-3 py-2 rounded-xl text-base font-semibold"
            >
              Dashboard
            </Link>
            <Link
              to="/restaurants"
              className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] block px-3 py-2 rounded-xl text-base font-semibold"
            >
              Restaurants
            </Link>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] block px-3 py-2 rounded-xl text-base font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#b1452a] text-white block px-3 py-2 rounded-xl text-base font-semibold text-center"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] block px-3 py-2 rounded-xl text-base font-semibold"
                >
                  Cart ({totalItems})
                </Link>
                <Link
                  to="/orders"
                  className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] block px-3 py-2 rounded-xl text-base font-semibold"
                >
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6] block px-3 py-2 rounded-xl text-base font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[#8f3721] block w-full text-left px-3 py-2 rounded-xl text-base font-semibold hover:bg-[#fff4e6]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
