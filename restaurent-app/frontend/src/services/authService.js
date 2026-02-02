import api from './api';
export const authService = {
    register: async (userData) =>{
        const response =await api.post('/auth/register', userData);
        if(response.data.token){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    login: async (credentials) =>{
        const response = await api.post('/auth/login', credentials );
        if(response.data.token){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
   getCurrentUser: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && !token) {
      localStorage.removeItem('user');
      return null;
    }
    
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  },
};


export default authService;