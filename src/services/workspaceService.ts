import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const workspaceService = {
  async getAllWorkspaces() {
    const response = await axiosInstance.get(
      `${API_URL}/workspace/get-workspaces`
    );
    return response.data;
  },

  async addWorkspace(name: string, description?: string) {
    const response = await axiosInstance.post(
      `${API_URL}/workspace/create-workspace`,
      {
        name,
        description,
      }
    );
    return response.data;
  },

  async editWorkspace(workspaceId: string, name: string, description?: string) {
    const response = await axiosInstance.put(
      `${API_URL}/workspace/update-workspace/${workspaceId}`,
      {
        name,
        description,
      }
    );
    return response.data;
  },

  async deleteWorkspace(workspaceId: string) {
    const response = await axiosInstance.delete(
      `${API_URL}/workspace/delete-workspace/${workspaceId}`
    );
    return response.data;
  },

  async getWorkspaceDetailById(workspaceId: string) {
    const response = await axiosInstance.get(
      `${API_URL}/workspace/get-workspace/${workspaceId}`
    );
    return response.data;
  },

  async getBoardsByWorkspaceId(workspaceId: string) {
    const response = await axiosInstance.get(
      `${API_URL}/board/get-boards-list/${workspaceId}`
    );
    return response.data;
  },
};
