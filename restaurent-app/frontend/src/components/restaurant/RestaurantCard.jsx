import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurants/${restaurant._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img 
          src={`https://via.placeholder.com/400x300?text=${encodeURIComponent(restaurant.name)}`}
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Restaurant Name */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {restaurant.name}
        </h3>

        {/* Description (truncated) */}
        {restaurant.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Rating & Cuisine */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-gray-700 font-medium">
              {restaurant.rating.toFixed(1)}
            </span>
          </div>

          {/* Cuisine Badge */}
          {restaurant.cuisine && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {restaurant.cuisine}
            </span>
          )}
        </div>

        {/* Address */}
        {restaurant.address && (
          <p className="text-gray-500 text-xs mt-2">
            📍 {restaurant.address}
          </p>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;