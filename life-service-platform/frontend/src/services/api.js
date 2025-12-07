import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// API请求方法
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
}

export const servicesAPI = {
  getServices: (params) => api.get('/services', { params }),
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
  addReview: (id, data) => api.post(`/services/${id}/review`, data)
}

export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`)
}

export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: (params) => api.get('/orders/user', { params }),
  getProviderOrders: (params) => api.get('/orders/provider', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  processPayment: (id, data) => api.post(`/orders/${id}/pay`, data)
}

// 直接导出认证相关函数，用于兼容旧代码
export const login = (data) => authAPI.login(data);
export const register = (data) => authAPI.register(data);
export const logout = () => { 
  localStorage.removeItem('token');
  return Promise.resolve();
};
export const getProfile = () => authAPI.getMe();
export const updateProfile = (data) => authAPI.updateProfile(data);

export default api