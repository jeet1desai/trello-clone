import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const boardService = {
  async getAllBoards() {
    const response = await axiosInstance.get(
      `${API_URL}/board/get-boards`
    );
    return response.data;
  },

  async addNewBoard(name: string, description: string, workspace: string, members: string[]) {
    const response = await axiosInstance.post(
      `${API_URL}/board/create-board`,
      {
        name,
        description,
        workspace,
        members
      }
    );
    return response.data;
  },

  async editBoard(boardId: string, name: string, description: string, workspace: string, members: string[]) {
    const response = await axiosInstance.put(
      `${API_URL}/board/update-board/${boardId}`,
      {
        name,
        description,
        workspace,
        members
      }
    );
    return response.data;
  },

  async deleteBoard(boardId: string) {
    const response = await axiosInstance.delete(
      `${API_URL}/board/delete-board/${boardId}`
    );
    return response.data;
  },

  async getBoardById(boardId: string) {
    const response = await axiosInstance.get(
      `${API_URL}/board/get-board/${boardId}`
    );
    return response.data;
  },

  async getBoardMemberListById(boardId: string) {
    const response = await axiosInstance.get(
      `${API_URL}/member/member-list/${boardId}`
    );
    return response.data;
  },
};
