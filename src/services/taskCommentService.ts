import axiosInstance from "../helper/axiosInstance";

export const taskCommentService = {
  async getCommentsById(taskId: string) {
    const response = await axiosInstance.get(`/comment/get/${taskId}`);
    return response.data;
  },

  async addTaskComment(
    taskId: string,
    comment: string,
    attachments: File[],
    mentionedMembers: string[]
  ) {
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("task_id", taskId);
    if (attachments.length > 0)
      attachments.map((attachment) =>
        formData.append("attachment", attachment)
      );
    if (mentionedMembers.length > 0)
      mentionedMembers.map((member) => formData.append("member", member));

    const response = await axiosInstance.post(`/comment/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteTaskComment(taskCommentId: string) {
    const response = await axiosInstance.delete(
      `/comment/delete/${taskCommentId}`
    );
    return response.data;
  },

  async updateTaskComment(
    taskId: string,
    updateTask: {
      comment: string;
      newAttachments: File[];
      removedAttachments: string[];
      mentionedMembers: string[];
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
    if (updateTask.mentionedMembers.length > 0)
      updateTask.mentionedMembers.map((member) =>
        formData.append("member", member)
      );

    const response = await axiosInstance.put(
      `/comment/update/${taskId}`,
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
