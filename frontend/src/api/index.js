import axios from 'axios';

// Use environment variable or default to port 5001
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with explicit configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try multiple sources for token
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('auth-token') ||
                  JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        console.warn('Authentication failed (401). Token may be invalid.');
        console.warn('Request URL:', error.config?.url);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  updateProfile: (id, data) => api.put(`/auth/update/${id}`, data),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getUserEvents: (userId) => api.get(`/events/${userId}/me`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Registrations API
export const registrationsAPI = {
  register: (userId, eventId) => api.post(`/event/registrations/${userId}/${eventId}`),
  cancel: (userId, eventId) => api.put(`/event/registrations/${userId}/${eventId}`),
  getUserRegistrations: (userId, status) =>
    api.get(`/event/users/${userId}/registrations`, { params: { status } }),
  getEventRegistrations: (eventId, status) =>
    api.get(`/event/${eventId}/registrations`, { params: { status } }),
  getTicket: (registrationId) => api.get(`/tickets/download/${registrationId}`, {
    responseType: 'blob',
  }),
};

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/payments', data),
};

// Tickets API
export const ticketsAPI = {
  generate: (registrationId) => api.get(`/tickets/${registrationId}`),
  download: (registrationId) => api.get(`/tickets/download/${registrationId}`, {
    responseType: 'blob',
  }),
};

// Waitlist API
export const waitlistAPI = {
  join: (eventId) => api.post(`/waitlist/${eventId}`),
  get: (eventId) => api.get(`/waitlist/${eventId}`),
  promote: (registrationId) => api.post(`/waitlist/promote/${registrationId}`),
};

// Analytics API
export const analyticsAPI = {
  getEvent: (eventId) => api.get(`/analytics/events/${eventId}`),
  getOrganizer: (organizerId) => api.get(`/analytics/organizer/${organizerId}`),
  getPlatform: () => api.get('/analytics/platform'),
  sendReminders: (eventId) => api.post(`/events/${eventId}/remind`),
};

export default api;
