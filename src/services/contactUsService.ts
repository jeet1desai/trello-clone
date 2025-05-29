import axiosInstance from "../helper/axiosInstance";

export const contactUsService = {
  async createTask(data: { name: string; email: string; description: string }) {
    const response = await axiosInstance.post(`/contact-us`, data);
    return response.data;
  },
};
