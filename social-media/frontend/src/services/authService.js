import api from "../api/api";

const AUTH_ENDPOINT = "/auth";

const register = async (userData) => {
  const response = await api.post(`${AUTH_ENDPOINT}/register`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post(`${AUTH_ENDPOINT}/login`, credentials);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

const getMe = async () => {
  const response = await api.get(`${AUTH_ENDPOINT}/me`);
  return response.data;
};
const authService = {
  register,
  login,
  logout,
  getMe,
};
export default authService;
