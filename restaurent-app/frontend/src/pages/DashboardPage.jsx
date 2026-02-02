import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRestaurants } from '../store/slices/restaurantSlice';
import { 
  FaUtensils, 
  FaShoppingCart, 
  FaClipboardList, 
  FaStar,
  FaArrowRight,
  FaUserCircle
} from 'react-icons/fa';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { restaurants, isLoading } = useSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurants({}));
  }, [dispatch]);

  // Calculate stats
  const totalRestaurants = restaurants?.length || 0;
  const averageRating = restaurants?.length > 0 
    ? (restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaUserCircle className="text-4xl text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your restaurant app today
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Restaurants */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Restaurants</p>
              <p className="text-3xl font-bold text-gray-800">
                {isLoading ? '...' : totalRestaurants}
              </p>
              <p className="text-sm text-gray-500 mt-1">Available now</p>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <FaUtensils className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">
                {isLoading ? '...' : averageRating}
              </p>
              <p className="text-sm text-gray-500 mt-1">Out of 5.0</p>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg">
              <FaStar className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Cart Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Cart Items</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-500 mt-1">Ready to order</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <FaShoppingCart className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Orders Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg">
              <FaClipboardList className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Browse Restaurants */}
        <Link 
          to="/restaurants"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Browse Restaurants</h3>
              <p className="text-blue-100">
                Discover {totalRestaurants} amazing restaurants
              </p>
            </div>
            <FaArrowRight className="text-3xl" />
          </div>
        </Link>

        {/* View Orders - Placeholder */}
        <Link 
          to="/orders"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">My Orders</h3>
              <p className="text-purple-100">
                Track your order history
              </p>
            </div>
            <FaArrowRight className="text-3xl" />
          </div>
        </Link>
      </div>

      {/* Featured Restaurants */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Top Rated Restaurants</h2>
          <Link 
            to="/restaurants" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading restaurants...
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurants.slice(0, 3).map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurants/${restaurant._id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <img 
                  src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(restaurant.name)}`}
                  alt={restaurant.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-gray-800 mb-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{restaurant.cuisine}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar />
                    <span className="text-gray-800 font-medium">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No restaurants available
          </div>
        )}
      </div>

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2">Admin Access</h3>
          <p className="mb-4">You have administrator privileges</p>
          <Link 
            to="/admin"
            className="inline-block bg-white text-orange-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Go to Admin Panel
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
