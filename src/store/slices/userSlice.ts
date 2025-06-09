import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
export interface User {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  profile_image: {
    imageId: string;
    imageName: string;
    url: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface GoogleAuthResponse {
  user: User;
  token: string;
}

export interface userActivity {
  activities: userActivityActivityArray[]
  pagination: userActivityPagination
}

export interface userActivityActivityArray {
  _id: string
  created_by: userActivityActivityArrayCreatedBy
  action: string
  module: string
  board: userActivityActivityArrayBoard
  task: userActivityActivityArrayTask | null
  details: string
  visible_to: string[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface userActivityActivityArrayCreatedBy {
  profile_image: userActivityProfileImage
  _id: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
}

export interface userActivityProfileImage {
  url: string
  imageId: string
  imageName: string
}

export interface userActivityActivityArrayBoard {
  _id: string
  name: string
}

export interface userActivityActivityArrayTask {
  _id: string
  title: string
}

export interface userActivityPagination {
  currentPage: number
  totalPages: number
  totalRecords: number
  limit: number
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  registrationSuccess: boolean;
  passwordChangeRequested: boolean;
  passwordChangeSuccess: boolean;
  passwordResetSuccess: boolean;
  verificationSuccess: boolean;
  userActivity: userActivity | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  success: null,
  registrationSuccess: false,
  passwordChangeRequested: false,
  passwordChangeSuccess: false,
  passwordResetSuccess: false,
  verificationSuccess: false,
  userActivity: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? "Login failed.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    {
      first_name,
      last_name,
      email,
      password,
    }: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(
        first_name,
        last_name,
        email,
        password
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Registration failed."
      );
    }
  }
);

export const verifyUser = createAsyncThunk(
  "user/verify",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyUser(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Verification failed."
      );
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "user/requestPasswordReset",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Password reset request failed."
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    {
      email,
      otp,
      newPassword: password,
    }: { email: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.changePassword(email, otp, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Password reset failed."
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.resetPassword(token, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Password reset failed."
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? "Logout failed.");
    }
  }
);

export const firebaseSocialLogin = createAsyncThunk(
  "auth/social-firebase-login",
  async (
    { token, screenName }: { token: string; screenName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.firebaseLogin(token, screenName);
      return response.data.user;
    } catch (error) {
      console.error("Google login failed", error);
      return rejectWithValue(error);
    }
  }
);

export const userActivity = createAsyncThunk(
  "auth/user-activity",
  async ({ userId, boardId }: { userId: string, boardId: string }, { rejectWithValue }) => {
    try {
      const response = await authService.userActivity(userId, boardId);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user activity", error);
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateImage: (state, action) => {
      state.currentUser = state.currentUser
        ? {
            ...state.currentUser,
            profile_image: action.payload.profile_image,
            first_name: action.payload.first_name,
            middle_name: action.payload.middle_name,
            last_name: action.payload.last_name,
            email: action.payload.email,
          }
        : null;
    },
    clearAuthState: (state) => {
      state.success = null;
      state.error = null;
      state.registrationSuccess = false;
      state.passwordChangeRequested = false;
      state.passwordChangeSuccess = false;
      state.passwordResetSuccess = false;
      state.verificationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //Social Firebase Login
      .addCase(firebaseSocialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(firebaseSocialLogin.fulfilled, (state, action) => {
        const {
          _id,
          first_name,
          middle_name,
          last_name,
          email,
          profile_image,
        } = action.payload;
        const currentUser = {
          id: _id,
          first_name,
          middle_name,
          last_name,
          email,
          profile_image,
        };
        state.currentUser = currentUser;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.success = "Login successful.";
      })
      .addCase(firebaseSocialLogin.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.success = null;
        state.error = (action.payload as string) || "Error while login.";
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload.data;
        const {
          _id,
          first_name,
          middle_name,
          last_name,
          email,
          profile_image,
        } = user;
        const currentUser = {
          id: _id,
          first_name,
          middle_name,
          last_name,
          email,
          profile_image,
        };
        state.currentUser = currentUser;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.success = null;
        state.error = (action.payload as string) || "Error while login.";
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.error = null;
        state.success =
          "Registration successful. Please check your email to verify your account.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || "Error while registration.";
      })

      // Request Password Change
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = true;
        state.error = null;
        state.success = "Password reset link has been sent to your email.";
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) ||
          "Error while sending password reset link.";
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = true;
        state.error = null;
        state.success = "Password updated successfully.";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while updating password.";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
        state.error = null;
        state.success = "Password has been reset successfully.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while resetting password.";
      })

      // Email Verification
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
        state.verificationSuccess = true;
        state.error = null;
        state.success = "Email verification successful. You can now log in.";
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) ||
          "Error while sending verification email.";
      })

      // Log out
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.clear();
        state.currentUser = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.success = null;
        state.error = "Error while logging out.";
      })

      // User activity
      .addCase(userActivity.pending, (state) => {
        state.userActivity = null;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(userActivity.fulfilled, (state, action) => {
        state.userActivity = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(userActivity.rejected, (state) => {
        state.loading = false;
        state.success = null;
        state.error = "Error while fetching user activity.";
      });
  },
});

export const { updateImage, clearAuthState } = userSlice.actions;

export default userSlice.reducer;
