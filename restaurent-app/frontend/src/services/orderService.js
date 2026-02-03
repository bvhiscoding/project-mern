import api from './api';

const orderService = {
  // CREATE ORDER
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // GET USER'S ORDERS
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // GET SINGLE ORDER
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // GET ALL ORDERS (Admin only)
  getAllOrders: async () => {
    const response = await api.get('/orders/all');
    return response.data;
  },

  // UPDATE ORDER STATUS (Admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // CANCEL ORDER
  cancelOrder: async (id) => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;
