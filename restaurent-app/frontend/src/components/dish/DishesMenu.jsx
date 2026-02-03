import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDishesByRestaurant, clearDishes } from '../../store/slices/dishSlice';
import DishCard from './DishCard';

const DishesMenu = ({ restaurantId, restaurantName }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const dispatch = useDispatch();
  const { dishes, isLoading, isError, message } = useSelector(state => state.dish);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchDishesByRestaurant(restaurantId));
    }

    return () => {
      dispatch(clearDishes());
    };
  }, [dispatch, restaurantId]);

  // Filter dishes by category
  const filteredDishes = useMemo(() => {
    if (activeCategory === 'all') return dishes;
    return dishes.filter(dish => dish.category === activeCategory);
  }, [dishes, activeCategory]);

  // Category configuration
  const categories = [
    { value: 'all', label: 'All Dishes', icon: '🍽️' },
    { value: 'appetizer', label: 'Appetizers', icon: '🥗' },
    { value: 'main', label: 'Main Course', icon: '🍝' },
    { value: 'dessert', label: 'Desserts', icon: '🍰' },
    { value: 'beverage', label: 'Beverages', icon: '🥤' },
  ];

  // Loading skeleton
  const SkeletonCard = () => (
    <div className="bg-white/90 border border-[#eadfce] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-[#f3e0b8]"></div>
      <div className="p-4">
        <div className="h-4 bg-[#f3e0b8] rounded w-20 mb-3"></div>
        <div className="h-6 bg-[#f3e0b8] rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[#f3e0b8] rounded w-full mb-2"></div>
        <div className="h-4 bg-[#f3e0b8] rounded w-2/3 mb-4"></div>
        <div className="h-10 bg-[#f3e0b8] rounded"></div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
              activeCategory === category.value
                ? 'bg-[#b1452a] text-white shadow-md'
                : 'bg-white/80 text-[#3c2f2a] border border-[#eadfce] hover:bg-[#fff4e6]'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-12 text-center">
          <div className="text-[#8f3721] text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-[#2b1e18] mb-2">
            Failed to Load Menu
          </h3>
          <p className="text-[#6d5b51] mb-6">{message}</p>
          <button
            onClick={() => dispatch(fetchDishesByRestaurant(restaurantId))}
            className="bg-[#b1452a] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#8f3721] transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredDishes.length === 0 && (
        <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-12 text-center">
          <div className="text-[#f3e0b8] text-6xl mb-4">
            {activeCategory === 'all' ? '🍽️' : categories.find(c => c.value === activeCategory)?.icon}
          </div>
          <h3 className="text-xl font-bold text-[#2b1e18] mb-2">
            No Dishes Found
          </h3>
          <p className="text-[#6d5b51]">
            {activeCategory === 'all' 
              ? 'This restaurant has no menu items yet.' 
              : `No ${activeCategory}s available.`}
          </p>
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 text-[#8f3721] font-semibold hover:underline"
            >
              View All Dishes
            </button>
          )}
        </div>
      )}

      {/* Dishes Grid */}
      {!isLoading && !isError && filteredDishes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map(dish => (
            <DishCard 
              key={dish._id} 
              dish={dish} 
              restaurantName={restaurantName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DishesMenu;
