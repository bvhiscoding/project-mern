import api from './api';

const dishService = {
  // GET ALL DISHES
  getAllDishes: async () => {
    const response = await api.get('/dishes');
    return response.data;
  },

  // GET DISHES BY RESTAURANT (Most Important!)
  getDishesByRestaurant: async (restaurantId) => {
    const response = await api.get(`/dishes/restaurant/${restaurantId}`);
    return response.data;
  },

  // GET SINGLE DISH by ID
  getDishById: async (id) => {
    const response = await api.get(`/dishes/${id}`);
    return response.data;
  },

  // CREATE DISH (Admin only)
  createDish: async (dishData) => {
    const response = await api.post('/dishes', dishData);
    return response.data;
  },

  // UPDATE DISH (Admin only)
  updateDish: async (id, dishData) => {
    const response = await api.put(`/dishes/${id}`, dishData);
    return response.data;
  },

  // DELETE DISH (Admin only)
  deleteDish: async (id) => {
    const response = await api.delete(`/dishes/${id}`);
    return response.data;
  },
};

export default dishService;