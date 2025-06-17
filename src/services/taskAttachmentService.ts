import axiosInstance from '../helper/axiosInstance';

export const taskAttachmentService = {
  async getAttachmentsById(taskId: string) {
    const response = await axiosInstance.get(`/task/get-attachment?taskId=${taskId}`);
    return response.data;
  },

  async addTaskAttachment(taskId: string, attachments: File[]) {
    const formData = new FormData();
    formData.append('task_id', taskId);
    if (attachments.length > 0) attachments.map((attachment) => formData.append('attachment', attachment));

    const response = await axiosInstance.post(`/task/attachment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteTaskAttachment(taskAttachmentId: string, taskId: string) {
    const response = await axiosInstance.delete(`/task/delete-attachment?taskId=${taskId}&imageId=${taskAttachmentId}`);
    return response.data;
  },
};
