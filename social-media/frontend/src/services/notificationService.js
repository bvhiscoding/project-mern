import api from "../api/api";

const ENDPOINT ='/notifications';

const getNotifications = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
}; 
const getUnreadCount = async () => {
  const response = await api.get(`${ENDPOINT}/unread-count`);
  return response.data; // { count: 5 }
};
const markAsRead = async (id) => {
  const response = await api.put(`${ENDPOINT}/${id}/read`);
  return response.data;
};
const markAllAsRead = async () => {
  const response = await api.put(`${ENDPOINT}/read-all`);
  return response.data;
};
const deleteNotification = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
const deleteAllNotifications = async () => {
  const response = await api.delete(ENDPOINT);
  return response.data;
};
const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
export default notificationService;