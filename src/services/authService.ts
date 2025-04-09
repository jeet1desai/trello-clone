import axios from 'axios';
import { API_URL } from '../config';

export const authService = {
  async register(name: string, email: string, phone: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, phone, password });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password });
    return response.data;
  }
}; 