import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL;

export const authService = {
  async register(first_name: string, middle_name: string, last_name: string, email: string, phone: string, password: string) {
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('middle_name', middle_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/auth/signup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async verifyUser(token: string) {
    const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
    return response.data.data;
  },

  async requestPasswordReset(email: string) {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  async changePassword(email: string, otp: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/change-password`, { email, otp, password });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password });
    return response.data;
  },

  async logout() {
    const response = await axios.get(`${API_URL}/auth/logout`);
    return response.data;
  },
}; 