import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/profileService";
import { message } from "antd";

export interface User {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  profile_image: string;
}

interface UserState {
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
};

// Async thunks
export const getProfileData = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfileData();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile details");
    }
  }
);
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    profileData: {
      first_name: string;
      middle_name: string;
      last_name: string;
      email: string;
      profile_image: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileService.updateProfile(profileData);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getProfileDataStart: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile Update
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        message.success("Profile updated successfully");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error((action.payload as string) || "Profile update failed");
      });
  },
});

export const { getProfileDataStart } = profileSlice.actions;

export default profileSlice.reducer;
