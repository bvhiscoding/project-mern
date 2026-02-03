import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart } from '../../store/slices/cartSlice';
import { FaMinus, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DishCard = ({ dish, restaurantName }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    // Check if cart has items from different restaurant
    if (items.length > 0 && items[0].restaurantId !== dish.restaurant) {
      const confirmClear = window.confirm(
        `Your cart contains items from ${items[0].restaurantName}. Clear cart and add items from ${restaurantName}?`
      );
      if (!confirmClear) {
        return; // User cancelled
      }
      // Clear cart first
      dispatch(clearCart());
    }

    dispatch(addToCart({
      dishId: dish._id,
      name: dish.name,
      price: dish.price,
      quantity: quantity,
      image: dish.image,
      restaurantId: dish.restaurant,
      restaurantName: restaurantName,
    }));

    toast.success(`Added ${quantity}x ${dish.name} to cart`);
    setQuantity(1); // Reset quantity after adding
  };

  // Category emoji mapping
  const categoryEmoji = {
    appetizer: '🥗',
    main: '🍝',
    dessert: '🍰',
    beverage: '🥤',
  };

  return (
    <div className="bg-white/90 border border-[#eadfce] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Dish Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={dish.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(dish.name)}`}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        
        {/* Availability Badge */}
        {!dish.isAvailable && (
          <div className="absolute top-3 right-3 bg-[#8f3721] text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>

      {/* Dish Info */}
      <div className="p-4">
        {/* Category Badge */}
        {dish.category && (
          <span className="inline-block bg-[#f3e0b8] text-[#3c2f2a] px-3 py-1 rounded-full text-xs font-semibold mb-2">
            {categoryEmoji[dish.category]} {dish.category.charAt(0).toUpperCase() + dish.category.slice(1)}
          </span>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-[#2b1e18] mb-2 line-clamp-1">
          {dish.name}
        </h3>

        {/* Description */}
        {dish.description && (
          <p className="text-[#6d5b51] text-sm mb-3 line-clamp-2">
            {dish.description}
          </p>
        )}

        {/* Price */}
        <p className="text-[#8f3721] font-bold text-xl mb-4">
          {dish.price.toLocaleString('vi-VN')} VNĐ
        </p>

        {/* Quantity Controls + Add to Cart */}
        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 border border-[#eadfce] rounded-xl overflow-hidden">
            <button
              onClick={handleDecrement}
              disabled={!dish.isAvailable || quantity <= 1}
              className="px-3 py-2 bg-[#fff4e6] hover:bg-[#f3e0b8] text-[#8f3721] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaMinus className="text-sm" />
            </button>
            
            <span className="px-4 font-semibold text-[#2b1e18] min-w-[2rem] text-center">
              {quantity}
            </span>
            
            <button
              onClick={handleIncrement}
              disabled={!dish.isAvailable}
              className="px-3 py-2 bg-[#fff4e6] hover:bg-[#f3e0b8] text-[#8f3721] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!dish.isAvailable}
            className="flex-1 bg-[#b1452a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#8f3721] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            {dish.isAvailable ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
