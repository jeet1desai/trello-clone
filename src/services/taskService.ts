import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const taskService = {
  async getTasksByStatusId(statusId: string) {
    const response = await axiosInstance.get(
      `${API_URL}/task/get-task?statusId=${statusId}`
    );
    return response.data;
  },

  async createTask(title: string, board_id: string, status_list_id: string) {
    const response = await axiosInstance.post(`${API_URL}/task/create-task`, {
      title,
      board_id,
      status_list_id,
    });
    return response.data;
  },

  async updateTask(
    taskId: string,
    title: string,
    description: string,
    status_list_id?: string,
    newPosition?: string,
    status?: string
  ) {
    const response = await axiosInstance.put(
      `${API_URL}/task/update-task`,
      {
        taskId,
        title,
        description,
        status_list_id,
        newPosition,
        status,
      }
    );
    return response.data;
  },

  async deleteTask(taskId: string) {
    const response = await axiosInstance.delete(
      `${API_URL}/task/delete-task/${taskId}`
    );
    return response.data;
  },

  async getTaskById(taskId: string) {
    const response = await axiosInstance.get(
      `${API_URL}/task/get-task/${taskId}`
    );
    return response.data;
  },
};
