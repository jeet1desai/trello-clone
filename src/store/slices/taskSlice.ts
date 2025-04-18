import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { taskService } from "../../services/taskService";

export interface IAttachment {
  imageName: string;
  imageId: string;
  url: string;
  _id: string;
}
export interface ITask {
  _id: string;
  title: string;
  description: string;
  board_id: string;
  created_by: string;
  priority?: string;
  status?: string;
  attachment: IAttachment[];
  status_list_id: {
    _id: string;
    name: string;
    description: string;
    board_id: {
      _id: string;
      name: string;
      description: string;
    };
  };
  position?: number;
}

interface TaskState {
  tasksByStatus: { [statusId: string]: ITask[] };
  selectedTask: ITask | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: TaskState = {
  tasksByStatus: {},
  selectedTask: null,
  loading: false,
  error: null,
  success: null,
};

export const getTasksByStatusId = createAsyncThunk(
  "task/get-tasks-by-status",
  async (statusId: string, { rejectWithValue }) => {
    try {
      const response = await taskService.getTasksByStatusId(statusId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching tasks."
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "task/create",
  async (
    {
      title,
      board_id,
      status_list_id,
    }: {
      title: string;
      board_id: string;
      status_list_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskService.createTask(
        title,
        board_id,
        status_list_id
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while creating task."
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/update",
  async (
    {
      taskId,
      title,
      status_list_id,
      newPosition,
      status,
      description,
    }: {
      taskId: string;
      title?: string;
      status_list_id?: string;
      newPosition?: number;
      status?: string;
      description?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskService.updateTask(
        taskId,
        title,
        status_list_id,
        newPosition,
        status,
        description
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while updating task."
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await taskService.deleteTask(taskId);
      return { taskId, ...response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while deleting task."
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
  "task/get-by-id",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await taskService.getTaskById(taskId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching task."
      );
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearTaskState: (state) => {
      state.tasksByStatus = {};
      state.selectedTask = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get tasks by status
      .addCase(getTasksByStatusId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTasksByStatusId.fulfilled, (state, action) => {
        const statusId = action.meta.arg;
        state.tasksByStatus[statusId] = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Tasks fetched successfully.";
      })
      .addCase(getTasksByStatusId.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching tasks.";
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const newTask = action.payload.data;
        const statusId = newTask.status_list_id._id;
        if (!state.tasksByStatus[statusId]) {
          state.tasksByStatus[statusId] = [];
        }
        state.tasksByStatus[statusId].push(newTask);
        state.loading = false;
        state.error = null;
        state.success = "Task created successfully.";
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while creating task.";
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.data;
        const newStatusId = updatedTask.status_list_id._id;
        let oldStatusId: string | null = null;

        debugger;
        for (const [statusId, tasks] of Object.entries(state.tasksByStatus)) {
          if (tasks.some((task) => task._id === updatedTask._id)) {
            oldStatusId = statusId;
            break;
          }
        }
        if (oldStatusId && oldStatusId !== newStatusId) {
          // Remove from old status list
          state.tasksByStatus[oldStatusId] = state.tasksByStatus[
            oldStatusId
          ].filter((task) => task._id !== updatedTask._id);

          // Add to new status list
          if (!state.tasksByStatus[newStatusId]) {
            state.tasksByStatus[newStatusId] = [];
          }
          state.tasksByStatus[newStatusId].push(updatedTask);
        } else if (oldStatusId) {
          // Update in the same status list
          state.tasksByStatus[oldStatusId] = state.tasksByStatus[
            oldStatusId
          ].map((task) => (task._id === updatedTask._id ? updatedTask : task));
        }
        if (state.selectedTask && state.selectedTask._id === updatedTask._id) {
          state.selectedTask = updatedTask;
        }
        state.loading = false;
        state.error = null;
        state.success = "Task updated successfully.";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while updating task.";
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { taskId } = action.payload;

        // Remove from tasksByStatus map
        for (const statusId in state.tasksByStatus) {
          state.tasksByStatus[statusId] = state.tasksByStatus[statusId].filter(
            (task) => task._id !== taskId
          );
        }
        if (state.selectedTask && state.selectedTask._id === taskId) {
          state.selectedTask = null;
        }
        state.loading = false;
        state.error = null;
        state.success = "Task deleted successfully.";
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while deleting task.";
      })

      // Get task by ID
      .addCase(getTaskById.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Task fetched successfully.";
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.selectedTask = null;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching task.";
      });
  },
});

export const { clearTaskState, setSelectedTask, clearSelectedTask } =
  taskSlice.actions;

export default taskSlice.reducer;
