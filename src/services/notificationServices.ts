import axiosInstance from "../helper/axiosInstance";

export const notificationService = {
  async getAllNotification() {
    const response = await axiosInstance.get(
      `/notification/notification-list/`
    );
    return response.data;
  },

  async readNotificationById(notificationId: string) {
    const response = await axiosInstance.put(
      `/notification/mark-notification/${notificationId}`
    );
    return response.data;
  },

  async readAllNotifications() {
    const response = await axiosInstance.put(
      `/notification/mark-all-notifications-read`
    );
    return response.data;
  },
};
