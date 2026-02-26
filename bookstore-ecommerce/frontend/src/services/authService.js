import api from "./api";

const ENDPOINT = "/api/auth";

const register = async (name, email, password) => {
  return api.post(`${ENDPOINT}/register`, { name, email, password });
};

const login = async (email, password) => {
  return api.post(`${ENDPOINT}/login`, { email, password });
};

const getUserProfile = async () => {
  return api.get(`${ENDPOINT}/profile`);
};

const updateProfile = async (profileData) => {
  return api.put(`${ENDPOINT}/profile`, profileData);
};

export default { register, login, getUserProfile, updateProfile };
