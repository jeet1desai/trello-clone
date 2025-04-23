import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardService } from "../../services/dashboardService"

export interface DashboardAnalyticResponse {
  week: {
    date: string;
    task: number;
    board: number;
  }[];
  tasks: {
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  boards: {
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
}

export interface DashboardCountResponse {
  workspace: number;
  board: number;
  task: number;
  totalTask: number;
}

interface DashboardState {
  dashboardAnalytic: DashboardAnalyticResponse | null;
  dashboardCount: DashboardCountResponse | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: DashboardState = {
  dashboardAnalytic: null,
  dashboardCount: null,
  loading: false,
  error: null,
  success: null,
};

export const getDashboardCount = createAsyncThunk(
  "dashboard/count",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardCount();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching dashboard count"
      );
    }
  }
);

export const getDashboardAnalytics = createAsyncThunk(
  "dashboard/analytic",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardAnalytics();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching dashboard analytics"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardState: (state) => {
      state.dashboardAnalytic = null;
      state.dashboardCount = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard count
      .addCase(getDashboardCount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getDashboardCount.fulfilled, (state, action) => {
        state.dashboardCount = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Dashboard count fetched successfully.";
      })
      .addCase(getDashboardCount.rejected, (state, action) => {
        state.loading = false;
        state.dashboardCount = null;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching Dashboard count.";
      })
      
      // Get dashboard analytics
      .addCase(getDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getDashboardAnalytics.fulfilled, (state, action) => {
        state.dashboardAnalytic = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Dashboard analytics fetched successfully.";
      })
      .addCase(getDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.dashboardAnalytic = null;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching dashboard analytics.";
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer; 