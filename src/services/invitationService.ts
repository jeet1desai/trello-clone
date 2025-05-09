import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const invitationService = {
  async getInvitations(page: number, status: string = "All") {
    const response = await axiosInstance.get(
      `${API_URL}/invite/admin-invite-details?status=${status}&perPage=5&page=${page}`
    );
    return response.data;
  },

  async manageInvitation(status: string, inviteId: string) {
    const response = await axiosInstance.patch(
      `${API_URL}/invite/admin-update-invite-status`,
      {
        status,
        inviteId,
      }
    );
    return response.data;
  },
};
