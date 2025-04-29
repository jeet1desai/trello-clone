import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/profileService";
import { User, updateImage } from "./userSlice";

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
        error.response?.data?.message ?? "Error while fetching profile details."
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
      profile_image: any;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await profileService.updateProfile(profileData);
      dispatch(updateImage(response.data))
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while updating profile details."
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "profile/reset-password",
  async (
    passwordDetails: {
      old_password: string;
      new_password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileService.resetPassword(passwordDetails);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while updating password."
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
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfileData.pending, (state) => {
        state.profileDetails = null;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        state.profileDetails = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Profile details fetched successfully.";
      })
      .addCase(getProfileData.rejected, (state, action) => {
        state.profileDetails = null;
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching profile details.";
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
        state.success = "Profile updated successfully.";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while updating profile details.";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = "Password updated successfully.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching profile details.";
      });
  },
});

export const { clearProfileStatus } = profileSlice.actions;

export default profileSlice.reducer;
