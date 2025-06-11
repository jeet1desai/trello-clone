import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationServices';

export interface Notification {
  _id: string;
  message: string;
  action: string;
  read: boolean;
  receiver: string;
  sender: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  link: string;
  __v: number;
}

interface NotificationState {
  allNotification: Notification[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: NotificationState = {
  allNotification: [],
  loading: false,
  error: null,
  success: null,
};

export const getAllNotification = createAsyncThunk('notification/notification-list', async (_, { rejectWithValue }) => {
  try {
    const response = await notificationService.getAllNotification();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching notifications.');
  }
});

export const readNotificationById = createAsyncThunk('notification/mark-notification', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await notificationService.readNotificationById(_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while marking notification as read.');
  }
});

export const readAllNotifications = createAsyncThunk('notification/mark-all-notification', async (_, { rejectWithValue }) => {
  try {
    const response = await notificationService.readAllNotifications();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while marking notifications as read.');
  }
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNewNotification: (state, action) => {
      state.allNotification = [action.payload.data, ...state.allNotification];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get notification
      .addCase(getAllNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getAllNotification.fulfilled, (state, action) => {
        state.allNotification = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Notifications fetched successfully.';
      })
      .addCase(getAllNotification.rejected, (state, action) => {
        state.loading = false;
        state.allNotification = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching notifications.';
      })

      // read notification
      .addCase(readNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(readNotificationById.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.allNotification.findIndex((notificationList) => notificationList._id === _id);
        state.allNotification = state.allNotification.filter((item) => item._id !== _id);
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.success = 'Notification read successfully.';
        } else {
          state.loading = false;
          state.error = 'Notification not found.';
        }
      })
      .addCase(readNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.allNotification = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while marking notification as read.';
      })

      // read all notification
      .addCase(readAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(readAllNotifications.fulfilled, (state) => {
        state.allNotification = [];
        state.loading = false;
        state.error = null;
        state.success = 'Notification read successfully.';
      })
      .addCase(readAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.allNotification = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while marking notification as read.';
      });
  },
});

export const { addNewNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
