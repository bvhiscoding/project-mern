import api from './api';
const restaurantService = {
  // GET ALL RESTAURANTS + filters
  getAllRestaurants: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.cuisine) params.append('cuisine', filters.cuisine);
    if (filters.minRating) params.append('minRating', filters.minRating);
    
    const queryString = params.toString();
    
    const url = queryString ? `/restaurants?${queryString}` : '/restaurants';
    

    const response = await api.get(url);
    
    return response.data;
  },
  // GET SINGLE RESTAURANT by ID
  getRestaurantById: async (id) => {
    // URL: /api/restaurants/65abc123...
    const response = await api.get(`/restaurants/${id}`);
    return response.data; 
  },

  // CREATE RESTAURANT (Admin only)
  createRestaurant: async (restaurantData) => {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  },
  // UPDATE RESTAURANT (Admin only)
  updateRestaurant: async (id, restaurantData) => {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },
  // DELETE RESTAURANT (Admin only)
  deleteRestaurant: async (id) => {
    // DELETE /api/restaurants/65abc123...
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  }
};
export default restaurantService;