import api from "./api";

const getProducts = async (params = {}) => {
  const response = await api.get("/api/products", { params });
  return response.data;
};

const getProductById = async (productId) => {
  const response = await api.get(`/api/products/${productId}`);
  return response.data;
};

const createProduct = async (productData) => {
  const response = await api.post("/api/products", productData);
  return response.data;
};

const updateProduct = async (productId, productData) => {
  const response = await api.put(`/api/products/${productId}`, productData);
  return response.data;
};

const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
