import axiosInstance from "../helper/axiosInstance";
import { BOARD_BACKGROUND_TYPE } from "../utils/enums/board";

export const boardService = {
  async getAllBoards(page: number, search: string, sortType: number) {
    const response = await axiosInstance.get(
      `/board/get-boards?page=${page}&search=${search}&sortType=${sortType}`
    );
    return response.data;
  },

  async addNewBoard(
    name: string,
    workspace: string,
    description?: string,
    members?: string[]
  ) {
    const response = await axiosInstance.post(`/board/create-board`, {
      name,
      description,
      workspace,
      members,
    });
    return response.data;
  },

  async editBoard(
    boardId: string,
    name: string,
    workspace: string,
    description?: string,
    members?: string[]
  ) {
    const response = await axiosInstance.put(`/board/update-board/${boardId}`, {
      name,
      description,
      workspace,
      members,
    });
    return response.data;
  },

  async deleteBoard(boardId: string) {
    const response = await axiosInstance.delete(
      `/board/delete-board/${boardId}`
    );
    return response.data;
  },

  async getBoardById(boardId: string) {
    const response = await axiosInstance.get(`/board/get-board/${boardId}`);
    return response.data;
  },

  async getBoardMemberListById(boardId: string, search: string) {
    const response = await axiosInstance.get(
      `/member/member-list/${boardId}?search=${search}`
    );
    return response.data;
  },

  async removeBoardMemberFromListById(boardId: string, memberId: string) {
    const response = await axiosInstance.delete(
      `/member/remove-member/${boardId}/${memberId}`
    );
    return response.data;
  },

  async leaveBoard(boardId: string) {
    const response = await axiosInstance.delete(
      `/member/leave-board/${boardId}`
    );
    return response.data;
  },

  async inviteBoardMember(boardId: string, members: string[]) {
    const response = await axiosInstance.post(
      `/invite/send-invitation/${boardId}`,
      {
        members,
      }
    );
    return response.data;
  },

  async getInvitationDetailsById(inviteId: string) {
    const response = await axiosInstance.get(
      `/invite/invite-details/${inviteId}`
    );
    return response.data;
  },

  async updateInvitationDetailsById(
    inviteId: string,
    data: { status: string }
  ) {
    const response = await axiosInstance.put(
      `/invite/update-invitation/${inviteId}`,
      data
    );
    return response.data;
  },

  async getAllLabelsById(boardId: string) {
    const response = await axiosInstance.get(`/label/get-labels/${boardId}`);
    return response.data;
  },

  async addNewLabel(
    name: string,
    board: string,
    background_color: string,
    text_color: string
  ) {
    const response = await axiosInstance.post(`/label/create-label`, {
      name,
      board,
      background_color,
      text_color,
    });
    return response.data;
  },

  async editLabel(
    labelId: string,
    name?: string,
    background_color?: string,
    text_color?: string
  ) {
    const response = await axiosInstance.put(`/label/update-label/${labelId}`, {
      name,
      background_color,
      text_color,
    });
    return response.data;
  },

  async deleteLabel(labelId: string) {
    const response = await axiosInstance.delete(
      `/label/delete-label/${labelId}`
    );
    return response.data;
  },

  async getLabelsByTaskId(taskId: string) {
    const response = await axiosInstance.get(`/tasklabel/get/${taskId}`);
    return response.data;
  },

  async addLabelInTask(task_id: string, label_id: string) {
    const response = await axiosInstance.post(`/tasklabel/add`, {
      task_id,
      label_id,
    });
    return response.data;
  },

  async removeLabelFromTask(taskId: string, labelId: string) {
    const response = await axiosInstance.delete(
      `/tasklabel/delete?taskId=${taskId}&labelId=${labelId}`
    );
    return response.data;
  },

  async getMembersByTaskId(taskId: string, search: string) {
    const response = await axiosInstance.get(
      `/task-member/get-task-member/${taskId}?search=${search}`
    );
    return response.data;
  },

  async addMemberInTask(task_id: string, member_id: string) {
    const response = await axiosInstance.post(`/task-member/add-member`, {
      task_id,
      member_id,
    });
    return response.data;
  },

  async removeMemberFromTask(taskId: string, memberId: string) {
    const response = await axiosInstance.delete(
      `/task-member/delete-member?taskId=${taskId}&memberId=${memberId}`
    );
    return response.data;
  },

  async duplicateTask(taskId: string, title: string) {
    const response = await axiosInstance.post(`/task/duplicate-task`, {
      taskId,
      title,
    });
    return response.data;
  },

  async toggleFavorite(boardId: string, isFavorite: boolean) {
    const response = await axiosInstance.put(`/board/favorite/${boardId}`, {
      isFavorite,
    });
    return response.data;
  },

  async getBackground() {
    const response = await axiosInstance.get(`/board/backgrounds`);
    return response.data;
  },

  async getUserBackground() {
    const response = await axiosInstance.get(`/user/board/background`);
    return response.data;
  },

  async postUserBackground(attachments: File[]) {
    const formData = new FormData();
    if (attachments.length > 0)
      attachments.map((attachment) =>
        formData.append("attachment", attachment)
      );
    const response = await axiosInstance.post(
      `/user/board/background`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async deleteUserBackground(imageId: string, boardId: string) {
    const response = await axiosInstance.delete(
      `/user/board/background?imageId=${imageId}&boardId=${boardId}`
    );
    return response.data;
  },

  async changebackground(
    boardId: string,
    backgroundType: BOARD_BACKGROUND_TYPE,
    background: string,
    imageId: string
  ) {
    const response = await axiosInstance.put(`/board/update-background`, {
      boardId,
      backgroundType,
      background,
      imageId,
    });
    return response.data;
  },

  async getAnalyticsData(boardId: string) {
    const response = await axiosInstance.get(
      `/board/analytics/${boardId}`
    );
    return response.data;
  },

  async getAllBoardsNoPagination() {
    const response = await axiosInstance.get(
      `/board/get-boards?all=true&sortType=1`
    );
    return response.data;
  },
};
