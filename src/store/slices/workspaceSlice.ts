import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { workspaceService } from "../../services/workspaceService";

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
  starred: boolean;
  archived: boolean;
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
  addError: string | null;
  editError: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  selectedWorkspace: null,
  workspaceBoards: [],
  loading: false,
  error: null,
  addError: null,
  editError: null,
};

export const getAllWorkspaces = createAsyncThunk(
  "workspace/get-all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getAllWorkspaces();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching workspace"
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
        error.response?.data?.message ||
          "Error while fetching workspace details"
      );
    }
  }
);

export const addNewWorkspace = createAsyncThunk(
  "workspace/add",
  async (
    { name, description }: { name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await workspaceService.addWorkspace(name, description);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while adding workspace"
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
    }: { _id: string; name: string; description: string },
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
        error.response?.data?.message || "Error while updating workspace"
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
        error.response?.data?.message || "Error while deleting workspace"
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
        error.response?.data?.message || "Error while fetching boards"
      );
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    openWorkspaceAddModal: (state) => {
      state.addError = null;
      state.loading = false;
    },
    toggleStarWorkspace: (state, action: PayloadAction<string>) => {
      const _id = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace._id === _id
      );
      if (index !== -1) {
        const currentStarred = !!state.workspaces[index].starred;
        state.workspaces[index].starred = !currentStarred;
        message.success(
          currentStarred
            ? "Workspace removed from starred"
            : "Workspace added to starred"
        );
      } else {
        message.error("Workspace not found");
      }
    },
    archiveWorkspace: (state, action: PayloadAction<string>) => {
      const _id = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace._id === _id
      );
      if (index !== -1) {
        state.workspaces[index].archived = true;
        message.success("Workspace archived successfully");
      } else {
        message.error("Workspace not found");
      }
    },
    restoreWorkspace: (state, action: PayloadAction<string>) => {
      const _id = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace._id === _id
      );
      if (index !== -1) {
        state.workspaces[index].archived = false;
        message.success("Workspace restored successfully");
      } else {
        message.error("Workspace not found");
      }
    },
    clearSelectedWorkspace: (state) => {
      state.selectedWorkspace = null;
      state.workspaceBoards = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Get all workspaces
      .addCase(getAllWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWorkspaces.fulfilled, (state, action) => {
        state.workspaces = action.payload;
        state.loading = false;
        state.error = null;
        message.success("Workspace fetched successfully");
      })
      .addCase(getAllWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.workspaces = [];
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Error while fetching workspace"
        );
      })

      // Fetch workspace details
      .addCase(getWorkspaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkspaceById.fulfilled, (state, action) => {
        state.selectedWorkspace = action.payload;
        state.loading = false;
        state.error = null;
        message.success("Workspace details fetched successfully");
      })
      .addCase(getWorkspaceById.rejected, (state, action) => {
        state.loading = false;
        state.selectedWorkspace = null;
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Error while fetching workspace details"
        );
      })

      // Add workspace
      .addCase(addNewWorkspace.pending, (state) => {
        state.loading = true;
        state.addError = null;
      })
      .addCase(addNewWorkspace.fulfilled, (state, action) => {
        const {
          _id,
          name,
          description,
          createdBy,
          createdAt,
          updatedAt,
          archived,
          starred,
        } = action.payload.data;
        const currentWorkspace = {
          _id: _id,
          name,
          description,
          createdBy,
          createdAt,
          updatedAt,
          archived,
          starred,
        };
        state.workspaces = [...state.workspaces, currentWorkspace];
        state.loading = false;
        state.addError = null;
        message.success("Workspace added successfully");
      })
      .addCase(addNewWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.addError = action.payload as string;
        message.error(
          (action.payload as string) || "Error while adding workspace"
        );
      })

      // Edit workspace
      .addCase(editWorkspace.pending, (state) => {
        state.loading = true;
        state.editError = null;
      })
      .addCase(editWorkspace.fulfilled, (state, action) => {
        const {
          _id,
          name,
          description,
          updatedAt,
          archived,
          starred,
        } = action.payload.data;
        const currentWorkspace = {
          _id,
          name,
          description,
          updatedAt,
          archived,
          starred,
        };
        const index = state.workspaces.findIndex(
          (workspace) => workspace._id === currentWorkspace._id
        );
        if (index !== -1) {
          state.loading = false;
          state.editError = null;
          state.workspaces[index] = {
            ...state.workspaces[index],
            ...currentWorkspace,
          };
          message.success("Workspace updated successfully");
        } else {
          state.loading = false;
          state.editError = "Workspace not found";
        }
      })
      .addCase(editWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.editError = action.payload as string;
        message.error(
          (action.payload as string) || "Error while updating workspace"
        );
      })

      // Delete workspace
      .addCase(deleteWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
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
          message.success("Workspace deleted successfully");
        } else {
          state.loading = false;
          state.error = "Workspace not found";
        }
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Error while fetching workspace"
        );
      })

      // Workspace boards
      .addCase(getBoardsByWorkspaceId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBoardsByWorkspaceId.fulfilled, (state, action) => {
        state.workspaceBoards = action.payload;
        state.loading = false;
        state.error = null;
        message.success("Boards fetched successfully");
      })
      .addCase(getBoardsByWorkspaceId.rejected, (state, action) => {
        state.loading = false;
        state.workspaceBoards = [];
        state.error = action.payload as string;
        message.error(
          (action.payload as string) || "Error while fetching boards"
        );
      });
  },
});

export const {
  openWorkspaceAddModal,
  toggleStarWorkspace,
  archiveWorkspace,
  restoreWorkspace,
  clearSelectedWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
