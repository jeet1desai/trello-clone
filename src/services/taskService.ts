import axiosInstance from "../helper/axiosInstance";
import { Priority } from "../utils/enums/task";

export const taskService = {
  async getTasksByStatusId(
    statusId: string,
    filter: { filterBy: string[]; labelIds?: string[] }
  ) {
    const response = await axiosInstance.post(`/task/get-task`, {
      statusId: statusId,
      ...filter,
    });
    return response.data;
  },

  async createTask(title: string, board_id: string, status_list_id: string) {
    const response = await axiosInstance.post(`/task/create-task`, {
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
    const response = await axiosInstance.put(`/task/update-task`, data);
    return response.data;
  },

  async deleteTask(taskId: string) {
    const response = await axiosInstance.delete(`/task/delete-task/${taskId}`);
    return response.data;
  },

  async getTaskById(taskId: string) {
    const response = await axiosInstance.get(`/task/get-task/${taskId}`);
    return response.data;
  },

  async assignMember(task_id: string, member_id: string) {
    const response = await axiosInstance.post(`/task-member/assign-member`, {
      task_id,
      member_id,
    });
    return response.data;
  },

    async recurringTask(taskId: string, repeat_type: string , start_date:string, end_date:string) {
    const response = await axiosInstance.post(`/task/repeat-task`, {
      taskId,
      repeat_type,
      start_date,
      end_date
    });
    return response.data;
  },

  async unassignMember(taskId: string) {
    const response = await axiosInstance.delete(
      `/task-member/unassign-member?taskId=${taskId}`
    );
    return response.data;
  },

  async addEstimatedTime(task_id: string, hours: number, minutes: number) {
    const response = await axiosInstance.put(
      `/task/add-estimated-time`,
      {
        task_id,
        hours,
        minutes
      }
    );
    return response.data;
  },

  async stratTimer(taskId: string) {
    const response = await axiosInstance.put(
      `/task/start-timer/${taskId}`
    );
    return response.data;
  },

  async stopTimer(taskId: string) {
    const response = await axiosInstance.put(
      `/task/stop-timer/${taskId}`
    );
    return response.data;
  },
};
