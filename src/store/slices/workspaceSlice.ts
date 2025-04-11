import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { workspaceService } from "../../services/workspaceService";

export interface IWorkspace {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  archived: boolean;
}

interface WorkspaceState {
  workspaces: IWorkspace[];
  loading: boolean;
  addError: string | null;
  editError: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [
    {
      id: "1",
      name: "Marketing",
      description: "Workspace for marketing team",
      createdBy: "user1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
      archived: false,
    },
    {
      id: "2",
      name: "Engineering",
      description: "Workspace for engineering team",
      createdBy: "user2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
      archived: true,
    },
    {
      id: "3",
      name: "Design",
      description: "Workspace for design team",
      createdBy: "user3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: true,
      archived: false,
    },
  ],
  loading: false,
  addError: null,
  editError: null,
};

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
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const editWorkspace = createAsyncThunk(
  "workspace/edit",
  async (
    { id, name, description }: { id: string; name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await workspaceService.editWorkspace(id, name, description);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
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
    editWorkspace: (
      state,
      action: PayloadAction<{
        id: string;
        data: Partial<Omit<IWorkspace, "id" | "updatedAt" | "createdBy">>;
      }>
    ) => {
      const { id, data } = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace.id === id
      );
      if (index !== -1) {
        state.workspaces[index] = {
          ...state.workspaces[index],
          ...data,
        };
        message.success("Workspace updated successfully");
      } else {
        message.error("Workspace not found");
      }
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace.id === id
      );
      if (index !== -1) {
        state.workspaces.splice(index, 1);
        message.success("Workspace deleted successfully");
      } else {
        message.error("Workspace not found");
      }
    },
    toggleStarWorkspace: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace.id === id
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
      const id = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace.id === id
      );
      if (index !== -1) {
        state.workspaces[index].archived = true;
        message.success("Workspace archived successfully");
      } else {
        message.error("Workspace not found");
      }
    },
    restoreWorkspace: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.workspaces.findIndex(
        (workspace) => workspace.id === id
      );
      if (index !== -1) {
        state.workspaces[index].archived = false;
        message.success("Workspace restored successfully");
      } else {
        message.error("Workspace not found");
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
          id: _id,
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
        message.error((action.payload as string) || "Error while adding workspace");
      });
  },
});

export const {
  openWorkspaceAddModal,
  deleteWorkspace,
  toggleStarWorkspace,
  archiveWorkspace,
  restoreWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
