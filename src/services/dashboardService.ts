import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const dashboardService = {
  async getDashboardCount() {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/dashboard/count`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard count:', error);
      throw error;
    }
  },

  async getDashboardAnalytics() {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/dashboard/analytic`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },
}; 