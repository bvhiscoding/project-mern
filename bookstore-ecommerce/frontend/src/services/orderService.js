import api from "./api";

const ENDPOINT = "/api/orders";

const createOrder = async (orderData) => {
  return api.post(ENDPOINT, orderData);
};

const getMyOrders = async () => {
  return api.get(`${ENDPOINT}/myorders`);
};

const getOrderById = async (id) => {
  return api.get(`${ENDPOINT}/${id}`);
};

const payOrder = async (id, paymentResult) => {
  return api.put(`${ENDPOINT}/${id}/pay`, { paymentResult });
};

const getAllOrders = async () => {
  return api.get(ENDPOINT);
};

const deliverOrder = async (id) => {
  return api.put(`${ENDPOINT}/${id}/deliver`);
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  getAllOrders,
  deliverOrder,
};
