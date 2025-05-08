import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { statusService } from "../../services/statusService";

export interface IStatusList {
  _id: string;
  name: string;
  description: string;
  board_id: {
    _id: string;
    name: string;
    description: string;
    createdBy: {
      _id: string;
      first_name: string;
      middle_name: string;
      last_name: string;
      email: string;
    };
    workspaceId: {
      _id: string;
      name: string;
      description: string;
    };
  };
  position: number;
  createdAt: string;
  updatedAt: string;
}

interface StatusState {
  statusList: IStatusList[];
  selectedStatus: IStatusList | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: StatusState = {
  statusList: [],
  selectedStatus: null,
  loading: false,
  error: null,
  success: null,
};

export const getStatusListByBoardId = createAsyncThunk(
  "status/get-status",
  async (boardId: string, { rejectWithValue }) => {
    try {
      const response = await statusService.getStatusListByBoardId(boardId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while fetching status."
      );
    }
  }
);

export const createNewStatus = createAsyncThunk(
  "list/add",
  async (
    {
      boardId,
      name,
    }: {
      boardId: string;
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await statusService.createNewStatus(boardId, name);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while adding status."
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "status/edit",
  async (
    {
      statusId,
      name,
      newPosition,
    }: {
      statusId: string;
      name?: string;
      newPosition?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await statusService.updateStatus(
        statusId,
        name,
        newPosition
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while updating status."
      );
    }
  }
);

export const deleteStatus = createAsyncThunk(
  "list/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await statusService.deleteStatus(_id);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while deleting status."
      );
    }
  }
);

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    addNewStatus: (state, action) => {
      state.statusList = [...state.statusList, action.payload.data];
    },
    removeStatus: (state, action) => {
      state.statusList = state.statusList.filter(status => status._id !== action.payload.data._id);
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    clearStatusState: (state) => {
      state.statusList = [];
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    updateStatusPosition: (state, action) => {
      const { _id, position } = action.payload.data;
      const statusIndex = state.statusList.findIndex(status => status._id === _id);
      if (statusIndex !== -1) {
        const updatedStatus = { ...state.statusList[statusIndex], position: position };
        state.statusList.splice(statusIndex, 1);
        const insertIndex = Math.min(Math.max(0, position - 1), state.statusList.length);
        state.statusList.splice(insertIndex, 0, updatedStatus);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //Get all status
      .addCase(getStatusListByBoardId.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(getStatusListByBoardId.fulfilled, (state, action) => {
        state.statusList = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Status fetched successfully.";
      })
      .addCase(getStatusListByBoardId.rejected, (state, action) => {
        state.loading = false;
        state.statusList = [];
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching status.";
      })

      // Add status
      .addCase(createNewStatus.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(createNewStatus.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = "Status added successfully.";
      })
      .addCase(createNewStatus.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while adding status.";
      })

      // Edit status
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateStatus.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = "Status updated successfully.";
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while updating status.";
      })

      // Delete status
      .addCase(deleteStatus.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.statusList.findIndex(
          (status) => status._id === _id
        );
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.statusList.splice(index, 1);
          state.success = "Status deleted successfully.";
        } else {
          state.loading = false;
          state.error = "Status not found.";
        }
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while deleting status.";
      });
  },
});

export const { addNewStatus, removeStatus, setSelectedStatus, clearStatusState, updateStatusPosition } = statusSlice.actions;

export default statusSlice.reducer;
