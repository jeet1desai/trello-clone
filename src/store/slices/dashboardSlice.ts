import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboardService';

export interface IUpcomingTask {
  _id: string;
  title: string;
  description: string;
  board_id: string;
  assigned_to: {
    first_name: string;
    last_name: string;
    _id: string;
  };
  end_date: string;
  priority: string;
  status: string;
}

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

export interface ProfileImage {
  url: string;
  imageId: string;
  imageName: string;
}

export interface CreatedBy {
  _id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  profile_image: ProfileImage;
}

export interface ActivityItem {
  _id: string;
  visible_to: string[];
  created_by: CreatedBy;
  action: string;
  module: string;
  createdAt: string;
  updatedAt: string;
  details: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

interface ActivitiesResponse {
  activities: ActivityItem[];
  pagination: Pagination;
}

export interface DashboardOverviewStateData {
  overview: DashboardOverviewStateDataOverview;
  teamMembers: TDashboardOverviewStateDataTeamMember[];
}

export interface DashboardOverviewStateDataOverview {
  totalUsers: number;
  totalSpentHours: number;
  totalTicketsClosed: number;
  totalActiveTickets: number;
  mostTicketsCompletedBy: string;
  mostTicketsCompletedCount: number;
}

export interface TDashboardOverviewStateDataTeamMember {
  name: string;
  email: string;
  joined: string;
  boardName: string;
  spentHours: number;
  ticketsClosed: number;
  activeTickets: number;
}

interface DashboardState {
  dashboardAnalytic: DashboardAnalyticResponse | null;
  dashboardCount: DashboardCountResponse | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  recentActivity: ActivitiesResponse;
  hasMore: boolean;
  loadingMore: boolean;
  recentActivityLoading: boolean;
  upcomingTasks: IUpcomingTask[];
  dashboardState: DashboardOverviewStateData | null;
}

const initialState: DashboardState = {
  dashboardAnalytic: null,
  dashboardCount: null,
  loading: false,
  error: null,
  success: null,
  recentActivity: {
    activities: [],
    pagination: {
      currentPage: 0,
      limit: 0,
      totalPages: 0,
      totalRecords: 0,
    },
  },
  hasMore: false,
  loadingMore: false,
  recentActivityLoading: false,
  upcomingTasks: [],
  dashboardState: null,
};

export const getDashboardCount = createAsyncThunk('dashboard/count', async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getDashboardCount();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching dashboard count');
  }
});

export const getDashboardAnalytics = createAsyncThunk('dashboard/analytic', async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getDashboardAnalytics();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching dashboard analytics');
  }
});

export const getDashboardRecentActivity = createAsyncThunk('dashboard/activity?page=', async (_page: number, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getDashboardRecentActivity(_page);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching dashboard analytics');
  }
});

export const getUpcomingTasks = createAsyncThunk('dashboard/upcoming-tasks', async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getUpcomingTasks();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching upcoming tasks');
  }
});

export const getDashboardState = createAsyncThunk('dashboard/state', async (payload: { boardId?: string } = {}, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getDashboardState(payload.boardId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching dashboard analytics');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardState: (state) => {
      state.dashboardAnalytic = null;
      state.dashboardCount = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    addNewRecentActivity: (state, action) => {
      state.recentActivity.activities = [action.payload.data, ...state.recentActivity.activities];
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
        state.success = 'Dashboard count fetched successfully.';
      })
      .addCase(getDashboardCount.rejected, (state, action) => {
        state.loading = false;
        state.dashboardCount = null;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching Dashboard count.';
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
        state.success = 'Dashboard analytics fetched successfully.';
      })
      .addCase(getDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.dashboardAnalytic = null;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching dashboard analytics.';
      })

      // Get dashboard recent activity
      .addCase(getDashboardRecentActivity.pending, (state) => {
        state.recentActivityLoading = true;
        state.loadingMore = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getDashboardRecentActivity.fulfilled, (state, action) => {
        const { activities, pagination } = action.payload;
        state.recentActivity.activities = [...state.recentActivity.activities, ...activities];
        state.recentActivity.pagination = pagination;
        state.hasMore = pagination.currentPage < pagination.totalPages;
        state.loadingMore = false;
        state.recentActivityLoading = false;
        state.error = null;
        state.success = 'Dashboard recent activity fetched successfully.';
      })
      .addCase(getDashboardRecentActivity.rejected, (state, action) => {
        state.recentActivityLoading = false;
        state.recentActivity = {
          activities: [],
          pagination: {
            currentPage: 0,
            limit: 0,
            totalPages: 0,
            totalRecords: 0,
          },
        };
        state.success = null;
        state.hasMore = false;
        state.loadingMore = false;
        state.error = (action.payload as string) || 'Error while fetching dashboard recent activity.';
      })

      // Get upcoming tasks
      .addCase(getUpcomingTasks.pending, (state) => {
        state.upcomingTasks = [];
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUpcomingTasks.fulfilled, (state, action) => {
        state.upcomingTasks = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Upcoming tasks fetched successfully.';
      })
      .addCase(getUpcomingTasks.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.upcomingTasks = [];
        state.error = (action.payload as string) || 'Error while fetching dashboard recent activity.';
      })

      // Get overview state
      .addCase(getDashboardState.pending, (state) => {
        state.dashboardState = null;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getDashboardState.fulfilled, (state, action) => {
        state.dashboardState = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Upcoming tasks fetched successfully.';
      })
      .addCase(getDashboardState.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.dashboardState = null;
        state.error = (action.payload as string) || 'Error while fetching dashboard state data.';
      });
  },
});

export const { clearDashboardState, addNewRecentActivity } = dashboardSlice.actions;
export default dashboardSlice.reducer;
