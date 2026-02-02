import api from './api';

const restaurantService = {
  // Get all restaurants with optional filters
  getAllRestaurants: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.cuisine) params.append('cuisine', filters.cuisine);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.isOpen !== undefined) params.append('isOpen', filters.isOpen);
    
    const queryString = params.toString();
    const url = queryString ? `/restaurants?${queryString}` : '/restaurants';
    
    const response = await api.get(url);
    return response.data;
  },

  // Get single restaurant by ID
  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  // Create new restaurant (Admin only)
  createRestaurant: async (restaurantData) => {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  },

  // Update restaurant (Admin only)
  updateRestaurant: async (id, restaurantData) => {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },

  // Delete restaurant (Admin only)
  deleteRestaurant: async (id) => {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },

  // Get restaurant dishes
  getRestaurantDishes: async (restaurantId) => {
    const response = await api.get(`/restaurants/${restaurantId}/dishes`);
    return response.data;
  }
};

export default restaurantService;
