import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { taskAttachmentService } from "../../services/taskAttachmentService";

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

export interface ITaskAttachment {
  _id: string;
  comment: string;
  attachment: IAttachment[];
  task_id: ITaskId;
  commented_by: ITaskCommentBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TaskAttachmentState {
  taskAttachments: IAttachment[];
  taskAttachmentLoading: boolean;
  error: string | null;
  success: string | null;
  addError: string | null;
  editError: string | null;
}

const initialState: TaskAttachmentState = {
  taskAttachments: [],
  taskAttachmentLoading: false,
  error: null,
  success: null,
  addError: null,
  editError: null,
};

export const getTaskAttachmentById = createAsyncThunk(
  "taskAttachment/get-comment-by-task-id",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await taskAttachmentService.getAttachmentsById(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while fetching task comment details."
      );
    }
  }
);

export const addNewTaskAttachment = createAsyncThunk(
  "taskAttachment/add-to-task",
  async (
    { taskId, attachments }: { taskId: string; attachments: File[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskAttachmentService.addTaskAttachment(
        taskId,
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

export const deleteTaskAttachment = createAsyncThunk(
  "taskAttachment/delete-to-task",
  async (data: { _id: string; taskId: string }, { rejectWithValue }) => {
    try {
      const response = await taskAttachmentService.deleteTaskAttachment(
        data._id,
        data.taskId
      );
      const responseData = { _id: data._id };
      if (response.success) return responseData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while deleting task comment."
      );
    }
  }
);

const taskAttachmentSlice = createSlice({
  name: "taskAttachment",
  initialState,
  reducers: {
    addNewAttachment: (state, action) => {
      const newAttachments = action.payload.data.attachment.filter(
        (newA: IAttachment) =>
          !state.taskAttachments.some(
            (existingA) => existingA.imageName === newA.imageName
          )
      );

      if (newAttachments.length > 0) {
        state.taskAttachments = [...state.taskAttachments, ...newAttachments];
      }
    },
    addTaskAttachment: (state) => {
      state.addError = null;
      state.taskAttachmentLoading = false;
    },
    clearSelectedTaskAttachment: (state) => {
      state.taskAttachments = [];
      state.taskAttachmentLoading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskAttachmentById.pending, (state) => {
        state.taskAttachmentLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTaskAttachmentById.fulfilled, (state, action) => {
        state.taskAttachments = action.payload;
        state.taskAttachmentLoading = false;
        state.error = null;
        state.success = "Task comment details fetched successfully.";
      })
      .addCase(getTaskAttachmentById.rejected, (state, action) => {
        state.taskAttachmentLoading = false;
        state.success = null;
        state.error =
          (action.payload as string) ||
          "Error while fetching task comment details.";
      })

      // Add task comment
      .addCase(addNewTaskAttachment.pending, (state) => {
        state.taskAttachmentLoading = true;
        state.addError = null;
        state.success = null;
        state.error = null;
      })
      .addCase(addNewTaskAttachment.fulfilled, (state, action) => {
        const newAttachments = action.payload.data.attachment.filter(
          (newA: { imageName: string }) =>
            !state.taskAttachments.some(
              (existingA) => existingA.imageName === newA.imageName
            )
        );
        if (newAttachments.length > 0)
          state.taskAttachments = [
            ...state.taskAttachments,
            ...action.payload.data.attachment,
          ];
        state.taskAttachmentLoading = false;
        state.addError = null;
        state.error = null;
        state.success = "Task comment added successfully.";
      })
      .addCase(addNewTaskAttachment.rejected, (state, action) => {
        state.taskAttachmentLoading = false;
        state.success = null;
        state.addError =
          (action.payload as string) || "Error while adding task comment.";
        state.error =
          (action.payload as string) || "Error while adding task comment.";
      })

      // Delete task comment
      .addCase(deleteTaskAttachment.pending, (state) => {
        state.taskAttachmentLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTaskAttachment.fulfilled, (state, action) => {
        const _id: string = action.payload?._id ?? "";
        const index = state.taskAttachments.findIndex(
          (taskAttachment) => taskAttachment._id === _id
        );
        if (index !== -1) {
          state.taskAttachmentLoading = false;
          state.error = null;
          state.taskAttachments.splice(index, 1);
          state.success = "Task comment deleted successfully.";
        } else {
          state.taskAttachmentLoading = false;
          state.error = "Task comment not found.";
        }
      })
      .addCase(deleteTaskAttachment.rejected, (state, action) => {
        state.taskAttachmentLoading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching task comment.";
      });
  },
});

export const {
  addNewAttachment,
  addTaskAttachment,
  clearSelectedTaskAttachment,
} = taskAttachmentSlice.actions;

export default taskAttachmentSlice.reducer;
