import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";
import { Priority } from "../utils/enums/task";

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

  async updateTask(data: {
    taskId: string;
    title?: string;
    status_list_id?: string;
    newPosition?: number;
    status?: string;
    description?: string;
    priority?: Priority;
    start_date?: string | null;
    end_date?: string | null;
  }) {
    const response = await axiosInstance.put(
      `${API_URL}/task/update-task`,
      data
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
