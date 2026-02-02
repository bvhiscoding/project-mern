import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, reset } from '../store/slices/restaurantSlice';
import RestaurantFilter from '../components/restaurant/RestaurantFilter';
import RestaurantList from '../components/restaurant/RestaurantList';

const RestaurantsPage = () => {
  const dispatch = useDispatch();
  const { restaurants, isLoading, isError, message } = useSelector(
    (state) => state.restaurant
  );
  
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    minRating: ''
  });

  // Fetch restaurants on mount and when filters change
  useEffect(() => {
    dispatch(fetchRestaurants(filters));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, filters]);

  // Handle filter changes
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Discover Restaurants
          </h1>
          <p className="text-gray-600 text-lg">
            Browse our selection of amazing restaurants
          </p>
        </div>

        {/* Filter Component */}
        <RestaurantFilter onFilter={handleFilter} />

        {/* Error Message */}
        {isError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Error loading restaurants</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}

        {/* Restaurant List */}
        <RestaurantList 
          restaurants={restaurants} 
          isLoading={isLoading} 
        />

        {/* Results Count */}
        {!isLoading && !isError && restaurants.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
