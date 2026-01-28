import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useState, useEffect } from "react";
import NotificationBadge from "../notification/NotificationBadge";
import NotificationDropdown from "../notification/NotificationDropdown";
import { fetchUnreadCount } from "../../store/slices/notificationSlice";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
    }
  };
  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_UPLOADS_URL}/${user.avatar}`
    : "/default-avatar.png";
  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
      // Optional: Fetch lại mỗi 30 giây
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [user, dispatch]);
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
        <Link to="/" className="text-2xl font-bold text-primary">
          SocialApp
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="Search user or post"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </form>
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {/* Bell Icon */}
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Badge */}
            <NotificationBadge />
          </button>

          {/* Dropdown */}
          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2"
            >
              <img
                src={avatarUrl}
                alt={user?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <Link
                  to={`/profile/${user?._id}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
