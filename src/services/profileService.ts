import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

export const profileService = {
  async getProfileData() {
    const response = await axios.get(`${API_URL}/user/profile`);
    return response.data.data;
  },

  async updateProfile(data: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    profile_image: string;
  }) {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("middle_name", data.middle_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("profile_image", data.profile_image);
    const response = await axios.put(`${API_URL}/user/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
