import RestaurantCard from './RestaurantCard';

const RestaurantList = ({ restaurants, isLoading }) => {
  // Loading State - Skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div 
            key={n} 
            className="bg-white/70 h-80 rounded-2xl border border-amber-100 animate-pulse"
          >
            <div className="h-48 bg-amber-50 mb-4"></div>
            <div className="px-4 space-y-3">
              <div className="h-4 bg-amber-100 rounded w-3/4"></div>
              <div className="h-3 bg-amber-100 rounded"></div>
              <div className="h-3 bg-amber-100 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-amber-200 text-8xl mb-6">
          🍽️
        </div>
        <h3 className="text-2xl font-semibold text-slate-700 mb-3">
          No restaurants found
        </h3>
        <p className="text-slate-500 mb-6">
          Try adjusting your filters or search criteria
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="text-amber-700 hover:text-amber-800 font-semibold"
        >
          Refresh page
        </button>
      </div>
    );
  }

  // Restaurant Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
      {restaurants.map((restaurant) => (
        <RestaurantCard 
          key={restaurant._id} 
          restaurant={restaurant} 
        />
      ))}
    </div>
  );
};

export default RestaurantList;
