import api from "./api";
const createReview = async (productId, payload) => {
  const { data } = await api.post(`/api/reviews/product/${productId}`, payload);
  return data;
};
const getProductReviews = async (productId) => {
  const { data } = await api.get(`/api/reviews/product/${productId}`);
  return data;
};
export default { createReview, getProductReviews };
