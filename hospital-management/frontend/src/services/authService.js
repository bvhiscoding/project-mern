/**
 * Auth Service
 * 
 * Service xử lý các API calls liên quan đến authentication:
 * - register: Đăng ký user mới
 * - login: Đăng nhập
 * - logout: Đăng xuất (xóa token khỏi localStorage)
 */

import api from './api'

// Đăng ký user mới
const register = async (userData) => {
  // userData = { name, email, password, role }
  const response = await api.post('/auth/register', userData)
  
  // Nếu đăng ký thành công, lưu user vào localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  
  return response.data
}

// Đăng nhập
const login = async (userData) => {
  // userData = { email, password }
  const response = await api.post('/auth/login', userData)
  
  // Nếu đăng nhập thành công, lưu user vào localStorage
  // response.data = { _id, name, email, role, token }
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  
  return response.data
}

// Đăng xuất
const logout = () => {
  // Xóa user khỏi localStorage
  localStorage.removeItem('user')
}

// Lấy thông tin user hiện tại
const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

const authService = {
  register,
  login,
  logout,
  getMe
}

export default authService
