import { useState, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';

const RestaurantFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    minRating: ''
  });

  // Debounced filter function
  const debouncedFilter = useCallback(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  // Debounce effect - 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedFilter();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, debouncedFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const emptyFilters = {
      search: '',
      cuisine: '',
      minRating: ''
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search restaurants..."
              value={filters.search}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Cuisine Dropdown */}
          <div>
            <select
              name="cuisine"
              value={filters.cuisine}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Cuisines</option>
              <option value="Italian">Italian</option>
              <option value="Seafood">Seafood</option>
              <option value="Asian">Asian</option>
              <option value="American">American</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Mexican">Mexican</option>
              <option value="French">French</option>
            </select>
          </div>

          {/* Min Rating Dropdown */}
          <div>
            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantFilter;
