import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById, clearSelectedRestaurant } from '../store/slices/restaurantSlice';
import { FaStar, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Restaurant Not Found
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft /> 
            <span className="font-medium">Back to Restaurants</span>
          </button>
        </div>
      </div>

      {/* Restaurant Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="rounded-lg overflow-hidden h-96 shadow-lg">
              <img
                src={`https://via.placeholder.com/800x600?text=${encodeURIComponent(restaurant.name)}`}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {restaurant.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                  <FaStar className="text-yellow-400 text-2xl" />
                  <span className="text-3xl font-bold text-gray-800">
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">/ 5.0</span>
                </div>
              </div>

              {/* Cuisine Badge */}
              {restaurant.cuisine && (
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                    🍴 {restaurant.cuisine} Cuisine
                  </span>
                </div>
              )}

              {/* Description */}
              {restaurant.description && (
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {restaurant.description}
                </p>
              )}

              {/* Address */}
              {restaurant.address && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-red-500 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="text-gray-800 font-medium">{restaurant.address}</p>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-6">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  restaurant.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isActive ? '✓ Open' : '✗ Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section Placeholder */}
      <div className="container mx-auto px-4 mt-8 max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Our Menu
        </h2>
        
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <div className="text-gray-300 text-6xl mb-4">🍕🍔🍣</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Menu Coming Soon
          </h3>
          <p className="text-gray-500">
            The restaurant menu will be displayed here in Phase 11
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
