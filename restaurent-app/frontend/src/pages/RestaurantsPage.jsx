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
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#eadfce] bg-white/85 p-6 md:p-10 shadow-sm">
            <div className="absolute -top-10 -right-12 h-36 w-36 rounded-full bg-[#f3e0b8]/60 blur-3xl" />
            <div className="absolute bottom-0 left-6 h-24 w-24 rounded-full bg-[#f2d6c2]/40 blur-3xl" />
            <div className="relative">
              <span className="chip mb-4">Taste guide</span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2b1e18] mb-3">
                Discover Restaurants
              </h1>
              <p className="text-[#5a463d] text-lg max-w-2xl">
                Browse handpicked places with cozy vibes, seasonal menus, and flavors worth sharing.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-[#8f3721]">
                <span className="px-3 py-1 rounded-full bg-white/70 border border-[#eadfce]">Chef picks</span>
                <span className="px-3 py-1 rounded-full bg-white/70 border border-[#eadfce]">Seasonal</span>
                <span className="px-3 py-1 rounded-full bg-white/70 border border-[#eadfce]">Local gems</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Component */}
        <RestaurantFilter onFilter={handleFilter} />

        {/* Error Message */}
        {isError && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
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
          <div className="mt-6 text-center text-[#6d5b51]">
            Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
