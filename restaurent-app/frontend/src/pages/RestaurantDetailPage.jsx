import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById, clearSelectedRestaurant } from '../store/slices/restaurantSlice';
import { FaStar, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import DishesMenu from '../components/dish/DishesMenu';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedRestaurant, isLoading, isError, message } = useSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(id));
    }

    return () => {
      dispatch(clearSelectedRestaurant());
    };
  }, [dispatch, id]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md card-surface p-8">
          <div className="text-rose-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Restaurant Not Found
          </h2>
          <p className="text-slate-600 mb-6">{message}</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="btn-primary px-6 py-3"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  if (!selectedRestaurant) {
    return null;
  }

  const restaurant = selectedRestaurant;

  return (
    <div className="pb-12">
      {/* Back Button */}
      <div className="border-b border-[#eadfce] bg-white/70 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-2 text-[#5a463d] hover:text-[#8f3721] transition-colors font-semibold"
          >
            <FaArrowLeft /> 
            <span>Back to Restaurants</span>
          </button>
        </div>
      </div>

      {/* Restaurant Header */}
      <div className="bg-white/80 border-b border-[#eadfce]">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Image Section */}
            <div className="rounded-3xl overflow-hidden h-96 shadow-lg border border-[#eadfce]">
              <img
                src={`https://via.placeholder.com/800x600?text=${encodeURIComponent(restaurant.name)}`}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center">
              <span className="chip mb-4">Signature flavors</span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2b1e18] mb-4">
                {restaurant.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-[#fff4e6] px-4 py-2 rounded-xl border border-[#eadfce]">
                  <FaStar className="text-[#c9793b] text-2xl" />
                  <span className="text-3xl font-bold text-[#2b1e18]">
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="text-[#6d5b51]">/ 5.0</span>
                </div>
              </div>

              {/* Cuisine Badge */}
              {restaurant.cuisine && (
                <div className="mb-6">
                  <span className="inline-block bg-[#f3e0b8] text-[#3c2f2a] px-4 py-2 rounded-full text-sm font-semibold">
                    🍴 {restaurant.cuisine} Cuisine
                  </span>
                </div>
              )}

              {/* Description */}
              {restaurant.description && (
                <p className="text-[#5a463d] mb-6 text-lg leading-relaxed">
                  {restaurant.description}
                </p>
              )}

              {/* Address */}
              {restaurant.address && (
                <div className="flex items-start gap-3 p-4 bg-[#fff4e6] rounded-xl border border-[#eadfce]">
                  <FaMapMarkerAlt className="text-[#8f3721] text-xl mt-1" />
                  <div>
                    <p className="text-sm text-[#6d5b51] mb-1">Location</p>
                    <p className="text-[#2b1e18] font-semibold">{restaurant.address}</p>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-6">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  restaurant.isActive 
                    ? 'bg-[#e9f3ea] text-[#3f6a4e]' 
                    : 'bg-[#fdecec] text-[#8f3721]'
                }`}>
                  {restaurant.isActive ? '✓ Open' : '✗ Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4 mt-12 max-w-7xl">
        <h2 className="section-title mb-6">
          Our Menu
        </h2>
        
        <DishesMenu restaurantId={restaurant._id} restaurantName={restaurant.name} />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
