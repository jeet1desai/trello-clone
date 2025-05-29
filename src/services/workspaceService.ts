import axiosInstance from "../helper/axiosInstance";

export const workspaceService = {
  async getAllWorkspaces(page: number, search: string, sortType: number) {
    const response = await axiosInstance.get(
      `/workspace/get-workspaces?page=${page}&search=${search}&sortType=${sortType}`
    );
    return response.data;
  },

  async addWorkspace(name: string, description?: string) {
    const response = await axiosInstance.post(`/workspace/create-workspace`, {
      name,
      description,
    });
    return response.data;
  },

  async editWorkspace(workspaceId: string, name: string, description?: string) {
    const response = await axiosInstance.put(
      `/workspace/update-workspace/${workspaceId}`,
      {
        name,
        description,
      }
    );
    return response.data;
  },

  async deleteWorkspace(workspaceId: string) {
    const response = await axiosInstance.delete(
      `/workspace/delete-workspace/${workspaceId}`
    );
    return response.data;
  },

  async getWorkspaceDetailById(workspaceId: string) {
    const response = await axiosInstance.get(
      `/workspace/get-workspace/${workspaceId}`
    );
    return response.data;
  },

  async getBoardsByWorkspaceId(workspaceId: string) {
    const response = await axiosInstance.get(
      `/board/get-boards-list/${workspaceId}`
    );
    return response.data;
  },

  async toggleFavorite(workspaceId: string, isFavorite: boolean) {
    const response = await axiosInstance.put(
      `/workspace/favorite/${workspaceId}`,
      { isFavorite }
    );
    return response.data;
  },
};
