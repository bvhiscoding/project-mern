import api from "./api";
const register = async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
}

const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
}

const getProfile = async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
}

const updateProfile = async (userData) => {
    const response = await api.put('/api/auth/profile', userData);
    return response.data;
}


export default {
    register,
    login,
    getProfile,
    updateProfile
}