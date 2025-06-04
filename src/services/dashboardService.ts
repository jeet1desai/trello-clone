import axiosInstance from "../helper/axiosInstance";

export const dashboardService = {
  async getDashboardCount() {
    try {
      const response = await axiosInstance.get(`/dashboard/count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard count:", error);
      throw error;
    }
  },

  async getDashboardAnalytics() {
    try {
      const response = await axiosInstance.get(`/dashboard/analytic`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      throw error;
    }
  },

  async getDashboardRecentActivity(page: number) {
    try {
      const response = await axiosInstance.get(`/user/activity?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard recent activity:", error);
      throw error;
    }
  },

  async getUpcomingTasks() {
    try {
      const response = await axiosInstance.get(`/task/upcoming-deadlines`);
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      throw error;
    }
  },

  async getDashboardState(boardId?: string) {
    try {
      const url = boardId ? `/board/dashboard/state?boardId=${boardId}` : `/board/dashboard/state`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard state:", error);
      throw error;
    }
  },
};
