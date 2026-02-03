import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurants/${restaurant._id}`}
      className="group bg-white/85 rounded-3xl border border-[#eadfce] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={`https://via.placeholder.com/400x300?text=${encodeURIComponent(restaurant.name)}`}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
        <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#3c2f2a]">
          <FaStar className="text-[#c9793b]" />
          {restaurant.rating.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Restaurant Name */}
        <h3 className="text-xl font-semibold text-[#2b1e18] mb-2">
          {restaurant.name}
        </h3>

        {/* Description (truncated) */}
        {restaurant.description && (
          <p className="text-[#5a463d] text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Rating & Cuisine */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <span className="text-xs uppercase tracking-[0.2em] text-[#8f3721] font-semibold">
            Signature
          </span>

          {/* Cuisine Badge */}
          {restaurant.cuisine && (
            <span className="bg-[#f3e0b8] text-[#3c2f2a] text-xs px-3 py-1 rounded-full font-semibold">
              {restaurant.cuisine}
            </span>
          )}
        </div>

        {/* Address */}
        {restaurant.address && (
          <p className="text-[#6d5b51] text-xs mt-3">
            📍 {restaurant.address}
          </p>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;
