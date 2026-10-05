import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Convert server errors into readable messages
export const errorMessage = (
  err,
  fallback = 'Something went wrong. Please try again.'
) =>
  err?.response?.data?.message ||
  (err?.request
    ? 'Cannot reach the server. Check your connection.'
    : fallback);

export const registerUser = (data) =>
  api.post('/auth/register', data);

export const loginUser = (data) =>
  api.post('/auth/login', data);

export const getMe = () =>
  api.get('/auth/me');

export const fetchTodos = () =>
  api.get('/todos');

export const createTodo = (data) =>
  api.post('/todos', data);

export const updateTodo = (id, data) =>
  api.put(`/todos/${id}`, data);

export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`);

export default api;