import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { workspaceService } from "../../services/workspaceService";
import { Pagination } from "./dashboardSlice";

export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IWorkspace {
  _id: string;
  name: string;
  description: string;
  createdBy: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IWorkspaceBoard {
  _id: string;
  name: string;
  description: string;
  members: [
    {
      _id: string;
      memberId: string;
      role: string;
      boardId: string;
      workspaceId: string;
      user: {
        _id: string;
        first_name: string;
        middle_name: string;
        last_name: string;
        email: string;
      };
    }
  ];
  boardOwner: {
    _id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
  };
}

interface WorkspaceState {
  workspaces: IWorkspace[];
  selectedWorkspace: IWorkspace | null;
  workspaceBoards: IWorkspaceBoard[];
  loading: boolean;
  error: string | null;
  success: string | null;
  addError: string | null;
  editError: string | null;
  workspacePagination: Pagination;
  hasMore: boolean;
}

const initialState: WorkspaceState = {
  workspaces: [],
  selectedWorkspace: null,
  workspaceBoards: [],
  loading: false,
  error: null,
  success: null,
  addError: null,
  editError: null,
  workspacePagination: {
    currentPage: 0,
    limit: 0,
    totalPages: 0,
    totalRecords: 0
  },
  hasMore: false,
};

export const getAllWorkspaces = createAsyncThunk(
  "workspace/get-all",
  async (
    {
      page,
      search,
      sortType
    }: {
      page: number;
      search: string;
      sortType: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await workspaceService.getAllWorkspaces(page, search, sortType);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while fetching workspaces."
      );
    }
  }
);

export const getWorkspaceById = createAsyncThunk(
  "workspace/get-workspace-by-id",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getWorkspaceDetailById(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Error while fetching workspace details."
      );
    }
  }
);

export const addNewWorkspace = createAsyncThunk(
  "workspace/add",
  async (
    { name, description }: { name: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await workspaceService.addWorkspace(name, description);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while adding workspace."
      );
    }
  }
);

export const editWorkspace = createAsyncThunk(
  "workspace/edit",
  async (
    {
      _id,
      name,
      description,
    }: { _id: string; name: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await workspaceService.editWorkspace(
        _id,
        name,
        description
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while updating workspace."
      );
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  "workspace/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await workspaceService.deleteWorkspace(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while deleting workspace."
      );
    }
  }
);

export const getBoardsByWorkspaceId = createAsyncThunk(
  "workspace/get-boards",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getBoardsByWorkspaceId(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error while fetching boards."
      );
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    updateWorkspaceBoards: (state, action) => {
      const { _id } = action.payload;
      const index = state.workspaceBoards.findIndex(
        (board) => board._id === _id
      );
      if (index !== -1) {
        state.workspaceBoards.splice(index, 1);
      }
    },
    openWorkspaceAddModal: (state) => {
      state.addError = null;
      state.loading = false;
    },
    clearSelectedWorkspace: (state) => {
      state.selectedWorkspace = null;
      state.workspaceBoards = [];
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Get all workspaces
      .addCase(getAllWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getAllWorkspaces.fulfilled, (state, action) => {
        const { workspaces, pagination } = action.payload;
        if (pagination.currentPage === 1) {
          state.workspaces = workspaces
        } else {
          state.workspaces = [
            ...state.workspaces,
            ...workspaces
          ];
        }
        state.workspacePagination = pagination;
        state.hasMore = pagination.currentPage < pagination.totalPages;
        state.loading = false;
        state.error = null;
        state.success = "Workspace fetched successfully.";
      })
      .addCase(getAllWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.workspaces = [];
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching workspaces.";
      })

      // Fetch workspace details
      .addCase(getWorkspaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getWorkspaceById.fulfilled, (state, action) => {
        state.selectedWorkspace = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Workspace details fetched successfully.";
      })
      .addCase(getWorkspaceById.rejected, (state, action) => {
        state.loading = false;
        state.selectedWorkspace = null;
        state.success = null;
        state.error =
          (action.payload as string) ||
          "Error while fetching workspace details.";
      })

      // Add workspace
      .addCase(addNewWorkspace.pending, (state) => {
        state.loading = true;
        state.addError = null;
        state.success = null;
        state.error = null;
      })
      .addCase(addNewWorkspace.fulfilled, (state, action) => {
        const { _id, name, description, createdBy, createdAt, updatedAt } =
          action.payload.data;
        const currentWorkspace = {
          _id: _id,
          name,
          description,
          createdBy,
          createdAt,
          updatedAt,
        };
        state.workspaces = [...state.workspaces, currentWorkspace];
        state.loading = false;
        state.addError = null;
        state.error = null;
        state.success = "Workspace added successfully.";
      })
      .addCase(addNewWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.addError =
          (action.payload as string) || "Error while adding workspace.";
        state.error =
          (action.payload as string) || "Error while adding workspace.";
      })

      // Edit workspace
      .addCase(editWorkspace.pending, (state) => {
        state.loading = true;
        state.editError = null;
        state.success = null;
        state.error = null;
      })
      .addCase(editWorkspace.fulfilled, (state, action) => {
        const { _id, name, description, updatedAt } = action.payload.data;
        const currentWorkspace = {
          _id,
          name,
          description,
          updatedAt,
        };
        const index = state.workspaces.findIndex(
          (workspace) => workspace._id === currentWorkspace._id
        );
        if (index !== -1) {
          state.loading = false;
          state.editError = null;
          state.error = null;
          state.workspaces[index] = {
            ...state.workspaces[index],
            ...currentWorkspace,
          };
          state.success = "Workspace updated successfully.";
        } else {
          state.loading = false;
          state.editError = "Workspace not found.";
          state.error = "Workspace not found.";
        }
      })
      .addCase(editWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.editError =
          (action.payload as string) || "Error while updating workspace.";
        state.error =
          (action.payload as string) || "Error while updating workspace.";
      })

      // Delete workspace
      .addCase(deleteWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.workspaces.findIndex(
          (workspace) => workspace._id === _id
        );
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.workspaces.splice(index, 1);
          state.success = "Workspace deleted successfully.";
        } else {
          state.loading = false;
          state.error = "Workspace not found.";
        }
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching workspace.";
      })

      // Workspace boards
      .addCase(getBoardsByWorkspaceId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getBoardsByWorkspaceId.fulfilled, (state, action) => {
        state.workspaceBoards = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Boards fetched successfully.";
      })
      .addCase(getBoardsByWorkspaceId.rejected, (state, action) => {
        state.loading = false;
        state.workspaceBoards = [];
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching boards.";
      });
  },
});

export const {
  updateWorkspaceBoards,
  openWorkspaceAddModal,
  clearSelectedWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
