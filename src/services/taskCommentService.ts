import { API_URL } from "../config";
import axiosInstance from "../helper/axiosInstance";

export const taskCommentService = {
  async getCommentsById(taskId: string) {
    const response = await axiosInstance.get(
      `${API_URL}/comment/get/${taskId}`
    );
    return response.data;
  },

  async addTaskComment(taskId: string, comment: string, attachments: File[]) {
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("task_id", taskId);
    if (attachments.length > 0)
      attachments.map((attachment) =>
        formData.append("attachment", attachment)
      );

    const response = await axiosInstance.post(
      `${API_URL}/comment/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async deleteTaskComment(taskCommentId: string) {
    const response = await axiosInstance.delete(
      `${API_URL}/comment/delete/${taskCommentId}`
    );
    return response.data;
  },

  async updateTaskComment(
    taskId: string,
    updateTask: {
      comment: string;
      newAttachments: File[];
      removedAttachments: string[];
    }
  ) {
    const formData = new FormData();
    formData.append("comment", updateTask.comment);
    if (updateTask.newAttachments.length > 0)
      updateTask.newAttachments.map((newAttachment) =>
        formData.append("attachment", newAttachment)
      );
    if (updateTask.removedAttachments.length > 0) {
      formData.append(
        "deletedAttachments",
        JSON.stringify(updateTask.removedAttachments)
      );
    }

    const response = await axiosInstance.put(
      `${API_URL}/comment/update/${taskId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
