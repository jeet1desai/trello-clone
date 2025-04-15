import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/profileService";
import { message } from "antd";
import { User } from "./userSlice";

interface UserState {
  loading: boolean;
  error: string | null;
  success: string | null;
  profileDetails: User | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: null,
  profileDetails: null,
};

// Async thunks
export const getProfileData = createAsyncThunk(
  "profile/get-profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfileData();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile details"
      );
    }
  }
);
export const updateProfile = createAsyncThunk(
  "profile/update-profile",
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
      return response.data;
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
    clearProfileStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfileData.pending, (state) => {
        state.profileDetails = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        state.profileDetails = action.payload;
        state.loading = false;
        state.error = null;
        message.success("Profile details fetched successfully");
      })
      .addCase(getProfileData.rejected, (state, action) => {
        state.profileDetails = null;
        state.loading = false;
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Error while fetching profile details"
        );
      })

      // Profile Update
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileDetails = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = "Error while updating profile";
      });
  },
});

export const { clearProfileStatus } = profileSlice.actions;

export default profileSlice.reducer;
