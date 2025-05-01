import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const contactUsService = {
  async createTask(data: { name: string; email: string; description: string }) {
    const response = await axiosInstance.post(`${API_URL}/contact-us`, data);
    return response.data;
  },
};
