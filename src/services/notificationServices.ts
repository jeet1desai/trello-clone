import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const notificationService = {
  async getAllNotification() {
    const response = await axiosInstance.get(
      `${API_URL}/notification/notification-list/`
    );
    return response.data;
  },

  async readNotificationById(notificationId: string) {
    const response = await axiosInstance.put(
      `${API_URL}/notification/mark-notification/${notificationId}`
    );
    return response.data;
  },
}; 