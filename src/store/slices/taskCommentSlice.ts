import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { taskCommentService } from "../../services/taskCommentService";

export interface IAttachment {
  imageName: string;
  imageId: string;
  url: string;
  _id: string;
}

interface IProfileImage {
  url: string;
  imageId: string;
  imageName: string;
}

interface ITaskId {
  _id: string;
  title: string;
  description: string;
  board_id: string;
  status_list_id: string;
  position: number;
}

export interface ITaskCommentBy {
  profile_image: IProfileImage;
  _id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  status: boolean;
}

export interface ITaskComment {
  _id: string;
  comment: string;
  attachment: IAttachment[];
  task_id: ITaskId;
  commented_by: ITaskCommentBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface WorkspaceState {
  taskComments: ITaskComment[];
  taskLoading: boolean;
  error: string | null;
  success: string | null;
  addError: string | null;
  editError: string | null;
}

const initialState: WorkspaceState = {
  taskComments: [],
  taskLoading: false,
  error: null,
  success: null,
  addError: null,
  editError: null,
};

export const getTaskCommentById = createAsyncThunk(
  "comment/get-comment-by-task-id",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await taskCommentService.getCommentsById(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while fetching workspace details."
      );
    }
  }
);

export const addNewTaskComment = createAsyncThunk(
  "comment/add-to-task",
  async (
    {
      taskId,
      comment,
      attachments,
    }: { taskId: string; comment: string; attachments: File[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskCommentService.addTaskComment(
        taskId,
        comment,
        attachments
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while adding workspace."
      );
    }
  }
);

export const deleteTaskComment = createAsyncThunk(
  "comment/delete-to-task",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await taskCommentService.deleteTaskComment(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while deleting workspace."
      );
    }
  }
);

const taskCommentSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    addTaskComment: (state) => {
      state.addError = null;
      state.taskLoading = false;
    },
    clearSelectedTaskComment: (state) => {
      state.taskComments = [];
      state.taskLoading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskCommentById.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTaskCommentById.fulfilled, (state, action) => {
        state.taskComments = action.payload;
        state.taskLoading = false;
        state.error = null;
        state.success = "Task comment details fetched successfully.";
      })
      .addCase(getTaskCommentById.rejected, (state, action) => {
        state.taskLoading = false;
        state.success = null;
        state.error =
          (action.payload as string) ||
          "Error while fetching task comment details.";
      })

      // Add workspace
      .addCase(addNewTaskComment.pending, (state) => {
        state.taskLoading = true;
        state.addError = null;
        state.success = null;
        state.error = null;
      })
      .addCase(addNewTaskComment.fulfilled, (state, action) => {
        state.taskComments = [...state.taskComments, action.payload.data];
        state.taskLoading = false;
        state.addError = null;
        state.error = null;
        state.success = "Task comment added successfully.";
      })
      .addCase(addNewTaskComment.rejected, (state, action) => {
        state.taskLoading = false;
        state.success = null;
        state.addError =
          (action.payload as string) || "Error while adding task comment.";
        state.error =
          (action.payload as string) || "Error while adding task comment.";
      })

      // Delete workspace
      .addCase(deleteTaskComment.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTaskComment.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.taskComments.findIndex(
          (taskComment) => taskComment._id === _id
        );
        if (index !== -1) {
          state.taskLoading = false;
          state.error = null;
          state.taskComments.splice(index, 1);
          state.success = "Task comment deleted successfully.";
        } else {
          state.taskLoading = false;
          state.error = "Task comment not found.";
        }
      })
      .addCase(deleteTaskComment.rejected, (state, action) => {
        state.taskLoading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching task comment.";
      });
  },
});

export const { addTaskComment, clearSelectedTaskComment } =
  taskCommentSlice.actions;

export default taskCommentSlice.reducer;
