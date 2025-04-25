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
}

const initialState: WorkspaceState = {
  taskComments: [],
  taskLoading: false,
  error: null,
  success: null,
};

export const getTaskCommentById = createAsyncThunk(
  "taskComment/get-comment-by-task-id",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await taskCommentService.getCommentsById(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while fetching task comment details."
      );
    }
  }
);

export const addNewTaskComment = createAsyncThunk(
  "taskComment/add-to-task",
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
        error.response?.data?.message || "Error while adding task comment."
      );
    }
  }
);

export const updateTaskComment = createAsyncThunk(
  "taskComment/update-to-task",
  async (
    {
      taskId,
      updateTask,
    }: {
      taskId: string;
      updateTask: {
        comment: string;
        newAttachments: File[];
        removedAttachments: string[];
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskCommentService.updateTaskComment(
        taskId,
        updateTask
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while adding task comment."
      );
    }
  }
);

export const deleteTaskComment = createAsyncThunk(
  "taskComment/delete-to-task",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await taskCommentService.deleteTaskComment(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while deleting task comment."
      );
    }
  }
);

const taskCommentSlice = createSlice({
  name: "taskComment",
  initialState,
  reducers: {
    addNewComment: (state, action) => {
      const {
        _id,
        comment,
        attachment,
        task_id,
        commented_by,
        createdAt,
        updatedAt,
        __v,
      } = action.payload.data;
      state.taskComments = [
        ...state.taskComments,
        {
          _id,
          comment,
          attachment,
          task_id,
          commented_by,
          createdAt,
          updatedAt,
          __v,
        },
      ];
    },
    updateComment: (state, action) => {
      state.taskComments = state.taskComments.map((comment) =>
          comment._id === action.payload.data._id
            ? action.payload.data
            : comment
        );
    },
    addTaskComment: (state) => {
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

      // Add task comment
      .addCase(addNewTaskComment.pending, (state) => {
        state.taskLoading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(addNewTaskComment.fulfilled, (state, action) => {
        const existingComment = state.taskComments.findIndex(
          (comment) => comment._id === action.payload.data._id
        );
        if (existingComment === -1)
          state.taskComments = [...state.taskComments, action.payload.data];
        state.taskLoading = false;
        state.error = null;
        state.success = "Task comment added successfully.";
      })
      .addCase(addNewTaskComment.rejected, (state, action) => {
        state.taskLoading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while adding task comment.";
      })

      // Update task comment
      .addCase(updateTaskComment.pending, (state) => {
        state.taskLoading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(updateTaskComment.fulfilled, (state, action) => {
        state.taskComments = state.taskComments.map((comment) =>
          comment._id === action.payload.data._id
            ? action.payload.data
            : comment
        );
        state.taskLoading = false;
        state.error = null;
        state.success = "Task comment updated successfully.";
      })
      .addCase(updateTaskComment.rejected, (state, action) => {
        state.taskLoading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while updating task comment.";
      })

      // Delete task comment
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

export const { addNewComment, updateComment, addTaskComment, clearSelectedTaskComment } =
  taskCommentSlice.actions;

export default taskCommentSlice.reducer;
