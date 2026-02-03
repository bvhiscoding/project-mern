import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import restaurantService from '../../services/restaurantService';

const initialForm = {
  name: '',
  image: '',
  description: '',
  address: '',
  cuisine: '',
  rating: '',
  isActive: true,
};

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const response = await restaurantService.getAllRestaurantsAdmin();
      setRestaurants(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'isActive') {
      setFormData((prev) => ({ ...prev, isActive: value === 'true' }));
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
    if (!formData.name.trim() || !formData.image.trim()) {
      toast.error('Name and image are required');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
      cuisine: formData.cuisine.trim(),
      isActive: formData.isActive,
    };

    if (formData.rating !== '') {
      payload.rating = Number(formData.rating);
    }

    try {
      if (editingId) {
        const response = await restaurantService.updateRestaurant(editingId, payload);
        setRestaurants((prev) => prev.map((item) => (item._id === editingId ? response.data : item)));
        toast.success('Restaurant updated');
      } else {
        const response = await restaurantService.createRestaurant(payload);
        setRestaurants((prev) => [response.data, ...prev]);
        toast.success('Restaurant created');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setFormData({
      name: restaurant.name || '',
      image: restaurant.image || '',
      description: restaurant.description || '',
      address: restaurant.address || '',
      cuisine: restaurant.cuisine || '',
      rating: restaurant.rating ?? '',
      isActive: restaurant.isActive ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    try {
      await restaurantService.deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((item) => item._id !== id));
      toast.success('Restaurant deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete restaurant');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f3721] font-semibold">Restaurants</p>
            <h1 className="text-2xl font-bold text-[#2b1e18] mt-2">Manage Restaurant Profiles</h1>
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
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Restaurant name"
            />
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
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Cuisine</label>
            <input
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Italian, Japanese..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Rating</label>
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="4.7"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Street, city"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5a463d] mb-2">Status</label>
            <select
              name="isActive"
              value={String(formData.isActive)}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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
              placeholder="Short description"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b1452a] text-white font-semibold hover:bg-[#8f3721]"
            >
              <FaPlus /> {editingId ? 'Update Restaurant' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#2b1e18] mb-4">Current Restaurants</h2>
        {isLoading ? (
          <p className="text-sm text-[#6d5b51]">Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p className="text-sm text-[#6d5b51]">No restaurants available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6d5b51]">
                  <th className="py-2">Name</th>
                  <th className="py-2">Cuisine</th>
                  <th className="py-2">Rating</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant._id} className="border-t border-[#eadfce]">
                    <td className="py-3">
                      <div className="font-semibold text-[#2b1e18]">{restaurant.name}</div>
                      <div className="text-xs text-[#6d5b51]">{restaurant.address || 'No address'}</div>
                    </td>
                    <td className="py-3 text-[#5a463d]">{restaurant.cuisine || '—'}</td>
                    <td className="py-3 text-[#5a463d]">{restaurant.rating?.toFixed(1) || '—'}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${restaurant.isActive ? 'bg-[#e9f3ea] text-[#3f6a4e]' : 'bg-[#fdecec] text-[#8f3721]'}`}>
                        {restaurant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(restaurant)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#eadfce] text-xs font-semibold text-[#3c2f2a] hover:bg-[#fff4e6]"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(restaurant._id)}
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

export default AdminRestaurantsPage;
