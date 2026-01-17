import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api';
// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Stock API calls
export const stockAPI = {
  // Lấy tất cả stocks
  getAll: function() {
    return api.get('/stocks');
  },
  
  // Tìm kiếm stocks
  search: function(query) {
    return api.get('/stocks/search?q=' + query);
  },
  
  // Lấy một stock theo ID
  getById: function(id) {
    return api.get('/stocks/' + id);
  },
};
// Watchlist API calls
export const watchlistAPI = {
  // Lấy tất cả watchlist items
  getAll: function() {
    return api.get('/watchlist');
  },
  
  // Thêm stock vào watchlist
  add: function(stockId) {
    return api.post('/watchlist', { stockId: stockId });
  },
  
  // Xóa stock khỏi watchlist
  remove: function(id) {
    return api.delete('/watchlist/' + id);
  },
};
export default api;