import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (slug) => API.get(`/products/${slug}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const getMyReview = (productId) => API.get(`/products/${productId}/my-review`);
export const getAllProductsAdmin = () => API.get('/products/admin/all');

// Categories
export const getCategories = (params) => API.get('/categories', { params });
export const getAllCategoriesAdmin = () => API.get('/categories/admin/all');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (itemId, data) => API.put(`/cart/${itemId}`, data);
export const removeFromCart = (itemId) => API.delete(`/cart/${itemId}`);
export const clearCart = () => API.delete('/cart/clear');

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const toggleWishlist = (data) => API.post('/wishlist/toggle', data);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const verifyPayment = (data) => API.post('/orders/verify-payment', data);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const cancelMyOrder = (id) => API.put(`/orders/${id}/cancel`);
export const getAllOrders = () => API.get('/orders/admin/all');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getDashboardStats = () => API.get('/orders/admin/dashboard');

// Admin Users
export const getAllUsers = () => API.get('/users');
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export default API;
