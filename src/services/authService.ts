import axiosInstance from "../helper/axiosInstance";

export const authService = {
  async register(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) {
    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("password", password);

    const response = await axiosInstance.post(`/auth/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async verifyUser(token: string) {
    const response = await axiosInstance.post(`/auth/verify-email`, {
      token,
    });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await axiosInstance.post(`/auth/signin`, {
      email,
      password,
    });
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const response = await axiosInstance.post(`/auth/forgot-password`, {
      email,
    });
    return response.data;
  },

  async changePassword(email: string, otp: string, password: string) {
    const response = await axiosInstance.post(`/auth/change-password`, {
      email,
      otp,
      password,
    });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await axiosInstance.post(`/auth/reset-password`, {
      token,
      password,
    });
    return response.data;
  },

  async logout() {
    const response = await axiosInstance.get(`/auth/logout`);
    return response.data;
  },

  async firebaseLogin(idToken: string, screenName: string) {
    const response = await axiosInstance.post(`/auth/social-firebase-login`, {
      idToken,
      screenName,
    });
    return response.data;
  },

  async userActivity(userId: string, boardId: string) {
    const response = await axiosInstance.get(`/user/activity/${userId}/${boardId}`);
    return response.data;
  },
};
