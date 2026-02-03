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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-[#eadfce] bg-white/85 p-6 md:p-10 shadow-sm">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#f3e0b8]/60 blur-3xl" />
          <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-[#f2d6c2]/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e0b8] text-[#8f3721]">
                <FaUserCircle className="text-3xl" />
              </span>
              <div>
                <span className="chip mb-3">Curated today</span>
                <h1 className="text-3xl md:text-4xl font-bold text-[#2b1e18]">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-[#5a463d]">
                  Discover seasonal picks and chef favorites across the city.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8f3721] font-semibold">Today</p>
                <p className="text-sm text-[#5a463d]">Taste, serve, delight</p>
              </div>
              <div className="h-10 w-px bg-[#eadfce]" />
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8f3721] font-semibold">Chef's note</p>
                <p className="text-sm text-[#5a463d]">Warm spices, slow comfort</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 stagger">
        {/* Total Restaurants */}
        <div className="bg-white/85 rounded-2xl border border-[#eadfce] shadow-sm p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#5a463d] mb-1">Total Restaurants</p>
              <p className="text-3xl font-bold text-[#2b1e18]">
                {isLoading ? '...' : totalRestaurants}
              </p>
              <p className="text-sm text-[#6d5b51] mt-1">Available now</p>
            </div>
            <div className="bg-[#b1452a] text-white p-4 rounded-xl">
              <FaUtensils className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white/85 rounded-2xl border border-[#eadfce] shadow-sm p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#5a463d] mb-1">Average Rating</p>
              <p className="text-3xl font-bold text-[#2b1e18]">
                {isLoading ? '...' : averageRating}
              </p>
              <p className="text-sm text-[#6d5b51] mt-1">Out of 5.0</p>
            </div>
            <div className="bg-[#c9793b] text-white p-4 rounded-xl">
              <FaStar className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Cart Placeholder */}
        <div className="bg-white/85 rounded-2xl border border-[#eadfce] shadow-sm p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#5a463d] mb-1">Cart Items</p>
              <p className="text-3xl font-bold text-[#2b1e18]">0</p>
              <p className="text-sm text-[#6d5b51] mt-1">Ready to order</p>
            </div>
            <div className="bg-[#3f6a4e] text-white p-4 rounded-xl">
              <FaShoppingCart className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Orders Placeholder */}
        <div className="bg-white/85 rounded-2xl border border-[#eadfce] shadow-sm p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#5a463d] mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-[#2b1e18]">0</p>
              <p className="text-sm text-[#6d5b51] mt-1">All time</p>
            </div>
            <div className="bg-[#2b1e18] text-white p-4 rounded-xl">
              <FaClipboardList className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 stagger">
        {/* Browse Restaurants */}
        <Link 
          to="/restaurants"
          className="bg-gradient-to-r from-[#b1452a] to-[#c9793b] text-white rounded-3xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Browse Restaurants</h3>
              <p className="text-amber-100">
                Discover {totalRestaurants} amazing restaurants
              </p>
            </div>
            <FaArrowRight className="text-3xl" />
          </div>
        </Link>

        {/* View Orders - Placeholder */}
        <Link 
          to="/orders"
          className="bg-gradient-to-r from-[#3c2f2a] to-[#2b1e18] text-white rounded-3xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">My Orders</h3>
              <p className="text-slate-200">
                Track your order history
              </p>
            </div>
            <FaArrowRight className="text-3xl" />
          </div>
        </Link>
      </div>

      {/* Featured Restaurants */}
      <div className="bg-white/85 rounded-3xl border border-[#eadfce] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Top Rated Restaurants</h2>
          <Link 
            to="/restaurants" 
            className="text-[#8f3721] hover:text-[#6f2a1a] font-semibold flex items-center gap-2"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-[#6d5b51]">
            Loading restaurants...
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
            {restaurants.slice(0, 3).map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurants/${restaurant._id}`}
                className="border border-[#eadfce] rounded-2xl p-4 hover:shadow-md transition-shadow bg-white/75"
              >
                <img 
                  src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(restaurant.name)}`}
                  alt={restaurant.name}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-[#2b1e18] mb-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5a463d]">{restaurant.cuisine}</span>
                  <div className="flex items-center gap-1 text-[#c9793b]">
                    <FaStar />
                    <span className="text-[#2b1e18] font-semibold">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#6d5b51]">
            No restaurants available
          </div>
        )}
      </div>

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <div className="mt-8 bg-gradient-to-r from-[#b1452a] to-[#c9793b] text-white rounded-3xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-2">Admin Access</h3>
          <p className="mb-4">You have administrator privileges</p>
          <Link 
            to="/admin"
            className="inline-block bg-white text-[#8f3721] px-6 py-2 rounded-full font-semibold hover:bg-[#fff4e6] transition-colors"
          >
            Go to Admin Panel
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
