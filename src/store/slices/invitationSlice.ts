import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invitationService } from '../../services/invitationService';
import { Pagination } from './dashboardSlice';

export interface Invitation {
  _id: string;
  name: string;
  email: string;
  boardId: {
    _id: string;
    name: string;
    createdBy: string;
  };
  invitedBy: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  workspaceId: string;
  status: string;
  is_approved_by_admin: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  invitees: {
    email: string;
    fullName: string;
  };
}

interface StatusState {
  invitationList: Invitation[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: StatusState = {
  invitationList: [],
  pagination: {
    currentPage: 0,
    limit: 0,
    totalPages: 0,
    totalRecords: 0,
  },
  loading: false,
  error: null,
  success: null,
};

export const getInvitationsList = createAsyncThunk(
  'notification/get-invitations',
  async (
    {
      page,
      status,
    }: {
      page: number;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await invitationService.getInvitations(page, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching invitations.');
    }
  }
);

export const manageInvitation = createAsyncThunk(
  'invitation/manage',
  async (
    {
      status,
      inviteId,
    }: {
      status: string;
      inviteId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await invitationService.manageInvitation(status, inviteId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while changing status.');
    }
  }
);

const invitationSlice = createSlice({
  name: 'invitation',
  initialState,
  reducers: {
    clearInvitationState: (state) => {
      state.invitationList = [];
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Get all invitations
      .addCase(getInvitationsList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getInvitationsList.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        state.invitationList = data;
        state.pagination = pagination;
        state.loading = false;
        state.error = null;
        state.success = 'Invitations fetched successfully.';
      })
      .addCase(getInvitationsList.rejected, (state, action) => {
        state.loading = false;
        state.invitationList = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching invitations.';
      })

      // Manage Invitation
      .addCase(manageInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(manageInvitation.fulfilled, (state, action) => {
        const { data } = action.payload;
        return {
          ...state,
          loading: false,
          error: null,
          success: 'Invitation updated successfully.',
          invitationList: state.invitationList.map((item) =>
            item._id === data._id
              ? {
                  ...item,
                  status: data.status,
                  is_approved_by_admin: data.is_approved_by_admin,
                }
              : item
          ),
        };
      })
      .addCase(manageInvitation.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while updating invitation.';
      });
  },
});

export const { clearInvitationState } = invitationSlice.actions;

export default invitationSlice.reducer;
