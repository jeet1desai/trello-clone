import axiosInstance from '../helper/axiosInstance';

export const statusService = {
  async getStatusListByBoardId(boardId: string) {
    const response = await axiosInstance.get(`/status/get-status?boardId=${boardId}`);
    return response.data;
  },

  async createNewStatus(board_id: string, name: string) {
    const response = await axiosInstance.post(`/status/create-status`, {
      board_id,
      name,
    });
    return response.data;
  },

  async updateStatus(statusId: string, name?: string, newPosition?: number, background?: string) {
    const response = await axiosInstance.put(`/status/update-status`, {
      statusId,
      name,
      newPosition,
      background,
    });
    return response.data;
  },

  async deleteStatus(statusId: string) {
    const response = await axiosInstance.delete(`/status/delete-status/${statusId}`);
    return response.data;
  },

  async removeStatusBackground(statusId: string) {
    const response = await axiosInstance.delete(`/status/remove-background-status/${statusId}`);
    return response.data;
  },
};
