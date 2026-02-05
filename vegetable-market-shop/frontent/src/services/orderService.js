import api from "./api";

const createOrder = async (payload) => {
  const { data } = await api.post('/api/orders', payload);
  return data;
};

const getMyOrders = async () => {
  const { data } = await api.get('/api/orders/myorders');
  return data;
};

const getOrderById = async (id) => {
  const { data } = await api.get(`/api/orders/${id}`);
  return data;
};

const getAllOrders = async () => {
  const { data } = await api.get('/api/orders');
  return data;
};

const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/api/orders/${id}/status`, { status });
  return data;
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
