import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { message } from "antd";

interface User {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  profile_image: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  passwordChangeRequested: boolean;
  passwordChangeSuccess: boolean;
  passwordResetSuccess: boolean;
  verificationSuccess: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
  passwordChangeRequested: false,
  passwordChangeSuccess: false,
  passwordResetSuccess: false,
  verificationSuccess: false,
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
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    {
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      password,
    }: {
      first_name: string;
      middle_name: string;
      last_name: string;
      email: string;
      phone: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        password
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
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
        error.response?.data?.message || "Verification failed"
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
        error.response?.data?.message || "Password reset request failed"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    { email, otp, newPassword: password }: { email: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.changePassword(email, otp, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
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
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.logout();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearAuthState: (state) => {
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
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
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
        message.success("Login successful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error((action.payload as string) || "Login failed");
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.error = null;
        message.success(
          "Registration successful. Please check your email to verify your account."
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error((action.payload as string) || "Registration failed");
      })

      // Request Password Change
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = true;
        state.error = null;
        message.success("Password reset link has been sent to your email");
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Failed to send password reset link"
        );
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = true;
        state.error = null;
        message.success("Password updated successfully");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Failed to update password"
        );
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
        state.error = null;
        message.success("Password has been reset successfully");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error((action.payload as string) || "Failed to reset password");
      })

      // Email Verification
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
        state.verificationSuccess = true;
        state.error = null;
        message.success("Email verification successful. You can now log in.");
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Email verification failed"
        );
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearAuthState,
} = userSlice.actions;

export default userSlice.reducer;
