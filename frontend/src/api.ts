import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/api/users/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/api/users/login', { email, password }),
  getProfile: () => api.get('/api/users/profile'),
  linkTelegram: (telegramId: string, telegramUsername: string) =>
    api.post('/api/users/link-telegram', { telegramId, telegramUsername }),
};

export const mealsAPI = {
  getMeals: () => api.get('/api/meals'),
  createMeal: (meal: any) => api.post('/api/meals', meal),
  updateMeal: (id: string, meal: any) => api.put(`/api/meals/${id}`, meal),
  deleteMeal: (id: string) => api.delete(`/api/meals/${id}`),
  getSchedule: (startDate: string, endDate: string) =>
    api.get(`/api/meals/schedule/${startDate}/${endDate}`),
  addToSchedule: (mealId: string, scheduledDate: string, mealType: string, servings: number) =>
    api.post('/api/meals/schedule', { mealId, scheduledDate, mealType, servings }),
  removeFromSchedule: (id: string) => api.delete(`/api/meals/schedule/${id}`),
};

export const botAPI = {
  getStatus: () => api.get('/api/bot/status'),
  sendMessage: (message: string) => api.post('/api/bot/send-message', { message }),
  getCommandHistory: (limit?: number) =>
    api.get('/api/bot/commands/history', { params: { limit } }),
  logCommand: (command: string) => api.post('/api/bot/command', { command }),
};

export default api;
