import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import dishService from '../../services/dishService';
import restaurantService from '../../services/restaurantService';

const initialForm = {
  name: '',
  price: '',
  image: '',
  description: '',
  category: 'main',
  restaurant: '',
  isAvailable: true,
};

const categories = ['appetizer', 'main', 'dessert', 'beverage'];

const AdminDishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dishesRes, restaurantsRes] = await Promise.all([
        dishService.getAllDishes(),
        restaurantService.getAllRestaurantsAdmin(),
      ]);
      setDishes(dishesRes.data || []);
      setRestaurants(restaurantsRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dishes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'isAvailable') {
      setFormData((prev) => ({ ...prev, isAvailable: value === 'true' }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.restaurant) {
      toast.error('Name, price, and restaurant are required');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      image: formData.image.trim(),
      description: formData.description.trim(),
      category: formData.category,
      restaurant: formData.restaurant,
      isAvailable: formData.isAvailable,
    };

    try {
      if (editingId) {
        const response = await dishService.updateDish(editingId, payload);
        setDishes((prev) => prev.map((item) => (item._id === editingId ? response.data : item)));
        toast.success('Dish updated');
      } else {
        const response = await dishService.createDish(payload);
        setDishes((prev) => [response.data, ...prev]);
        toast.success('Dish created');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save dish');
    }
  };

  const handleEdit = (dish) => {
    setEditingId(dish._id);
    setFormData({
      name: dish.name || '',
      price: dish.price ?? '',
      image: dish.image || '',
      description: dish.description || '',
      category: dish.category || 'main',
      restaurant: dish.restaurant?._id || dish.restaurant || '',
      isAvailable: dish.isAvailable ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dish?')) return;
    try {
      await dishService.deleteDish(id);
      setDishes((prev) => prev.filter((item) => item._id !== id));
      toast.success('Dish deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete dish');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f3721] font-semibold">Dishes</p>
            <h1 className="text-2xl font-bold text-[#2b1e18] mt-2">Manage Menu Items</h1>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#eadfce] text-sm font-semibold text-[#3c2f2a] hover:bg-[#fff4e6]"
            >
              <FaTimes /> Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Dish Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Seared salmon"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Price</label>
            <input
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="120000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Restaurant</label>
            <select
              name="restaurant"
              value={formData.restaurant}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">Select restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Image URL</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Availability</label>
            <select
              name="isAvailable"
              value={String(formData.isAvailable)}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Short dish description"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b1452a] text-white font-semibold hover:bg-[#8f3721]"
            >
              <FaPlus /> {editingId ? 'Update Dish' : 'Add Dish'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#2b1e18] mb-4">Menu Items</h2>
        {isLoading ? (
          <p className="text-sm text-[#6d5b51]">Loading dishes...</p>
        ) : dishes.length === 0 ? (
          <p className="text-sm text-[#6d5b51]">No dishes available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6d5b51]">
                  <th className="py-2">Dish</th>
                  <th className="py-2">Restaurant</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish._id} className="border-t border-[#eadfce]">
                    <td className="py-3">
                      <div className="font-semibold text-[#2b1e18]">{dish.name}</div>
                      <div className="text-xs text-[#6d5b51]">{dish.description || 'No description'}</div>
                    </td>
                    <td className="py-3 text-[#5a463d]">{dish.restaurant?.name || 'N/A'}</td>
                    <td className="py-3 text-[#5a463d] capitalize">{dish.category || '—'}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dish.isAvailable ? 'bg-[#e9f3ea] text-[#3f6a4e]' : 'bg-[#fdecec] text-[#8f3721]'}`}>
                        {dish.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[#2b1e18] font-semibold">
                      {dish.price?.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(dish)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#eadfce] text-xs font-semibold text-[#3c2f2a] hover:bg-[#fff4e6]"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(dish._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#f1d6c7] text-xs font-semibold text-[#8f3721] hover:bg-[#fff4e6]"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDishesPage;
