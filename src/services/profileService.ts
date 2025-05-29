import axiosInstance from "../helper/axiosInstance";

export const profileService = {
  async getProfileData() {
    const response = await axiosInstance.get(`/user/profile`);
    return response.data.data;
  },

  async updateProfile(data: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    profile_image: any;
  }) {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("middle_name", data.middle_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("profile_image", data.profile_image);
    const response = await axiosInstance.put(`/user/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async resetPassword(data: { old_password: string; new_password: string }) {
    const response = await axiosInstance.post(`/auth/reset-password`, {
      old_password: data.old_password,
      new_password: data.new_password,
    });
    return response.data;
  },
};
