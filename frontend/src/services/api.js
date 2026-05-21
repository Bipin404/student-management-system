import axios from 'axios';

// Base URL of our backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────
// Automatically adds token to every request
// So we don't have to manually add it every time
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── AUTH API CALLS ───────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── STUDENT API CALLS ────────────────────────────────────
export const studentAPI = {
  // Get all students with optional search and pagination
  getAll: (params) => api.get('/students', { params }),

  // Get single student by id
  getOne: (id) => api.get(`/students/${id}`),

  // Create new student (FormData for file upload)
  create: (data) => api.post('/students', data),

  // Update student
  update: (id, data) => api.put(`/students/${id}`, data),

  // Delete student
  delete: (id) => api.delete(`/students/${id}`),

  // Get analytics data
  getAnalytics: () => api.get('/students/analytics'),
};

export default api;