import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { taskService } from "../../services/taskService";
import { Priority } from "../../utils/enums/task";

export interface IAttachment {
  imageName: string;
  imageId: string;
  url: string;
  _id: string;
}

interface ILabels {
  _id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  boardId: string;
}
export interface ITask {
  _id: string;
  title: string;
  description: string;
  board_id: string;
  created_by: string;
  priority?: Priority;
  status?: string;
  attachment: IAttachment[];
  labels: ILabels[];
  comments: number;
  start_date: string | null;
  end_date: string | null;
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
    data: {
      taskId: string;
      title?: string;
      status_list_id?: string;
      newPosition?: number;
      status?: string;
      description?: string;
      priority?: Priority;
      end_date?: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskService.updateTask(data);
      return response.data;
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
    addNewTask: (state, action) => {
      const statusListId =
        action.payload.data.status_list_id._id ||
        action.payload.data.status_list_id;
      if (!state.tasksByStatus[statusListId]) {
        state.tasksByStatus[statusListId] = [];
      }
      state.tasksByStatus[statusListId].push(action.payload.data);
    },
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
    updateTaskPosition: (state, action) => {
      const task = action.payload.data;
      const taskId = task._id;
      const newPosition = task.position;
      const status_list_id = task.status_list_id;

      let sourceStatusId = "";
      let taskIndex = -1;
      Object.entries(state.tasksByStatus).forEach(([statusId, tasks]) => {
        const index = tasks.findIndex((t) => t._id === taskId);
        if (index !== -1) {
          sourceStatusId = statusId;
          taskIndex = index;
        }
      });

      if (taskIndex === -1) return; // Task not found
      const taskToMove = { ...state.tasksByStatus[sourceStatusId][taskIndex] };
      state.tasksByStatus[sourceStatusId].splice(taskIndex, 1);

      if (status_list_id && status_list_id !== sourceStatusId) {
        if (!state.tasksByStatus[status_list_id]) {
          state.tasksByStatus[status_list_id] = [];
        }

        if (typeof taskToMove.status_list_id === "object") {
          taskToMove.status_list_id._id = status_list_id;
        } else {
          taskToMove.status_list_id = status_list_id;
        }

        taskToMove.position = newPosition;
        const destInsertIndex = Math.min(
          Math.max(0, newPosition - 1),
          state.tasksByStatus[status_list_id].length
        );
        state.tasksByStatus[status_list_id].splice(
          destInsertIndex,
          0,
          taskToMove
        );
      } else {
        taskToMove.position = newPosition;
        const insertIndex = Math.min(
          Math.max(0, newPosition - 1),
          state.tasksByStatus[sourceStatusId].length
        );
        state.tasksByStatus[sourceStatusId].splice(insertIndex, 0, taskToMove);
      }
    },
    updateTaskInState: (state, action) => {
      const updatedTask = action.payload.data;
      const taskId = updatedTask._id;
      for (const statusId in state.tasksByStatus) {
        const taskIndex = state.tasksByStatus[statusId].findIndex(
          (task) => task._id === taskId
        );

        if (taskIndex !== -1) {
          if (
            updatedTask.status_list_id &&
            updatedTask.status_list_id !== statusId
          ) {
            const taskToUpdate = {
              ...state.tasksByStatus[statusId][taskIndex],
            };
            state.tasksByStatus[statusId].splice(taskIndex, 1);
            const newStatusId =
              typeof updatedTask.status_list_id === "object"
                ? updatedTask.status_list_id._id
                : updatedTask.status_list_id;

            if (!state.tasksByStatus[newStatusId]) {
              state.tasksByStatus[newStatusId] = [];
            }
            if (updatedTask.title !== undefined) {
              taskToUpdate.title = updatedTask.title;
            }
            if (updatedTask.description !== undefined) {
              taskToUpdate.description = updatedTask.description;
            }
            if (updatedTask.priority !== undefined) {
              taskToUpdate.priority = updatedTask.priority;
            }
            if (updatedTask.status !== undefined) {
              taskToUpdate.status = updatedTask.status;
            }
            if (updatedTask.end_date !== undefined) {
              taskToUpdate.end_date = updatedTask.end_date;
            }
            if (updatedTask.start_date !== undefined) {
              taskToUpdate.start_date = updatedTask.start_date;
            }
            if (typeof updatedTask.status_list_id === "object") {
              taskToUpdate.status_list_id = updatedTask.status_list_id;
            } else {
              if (typeof taskToUpdate.status_list_id === "object") {
                taskToUpdate.status_list_id._id = newStatusId;
              } else {
                taskToUpdate.status_list_id = { _id: newStatusId } as any;
              }
            }
            // Add to new status list
            state.tasksByStatus[newStatusId].push(taskToUpdate);
          } else {
            const task = state.tasksByStatus[statusId][taskIndex];

            if (updatedTask.title !== undefined) {
              task.title = updatedTask.title;
            }
            if (updatedTask.description !== undefined) {
              task.description = updatedTask.description;
            }
            if (updatedTask.priority !== undefined) {
              task.priority = updatedTask.priority;
            }
            if (updatedTask.status !== undefined) {
              task.status = updatedTask.status;
            }
            if (updatedTask.end_date !== undefined) {
              task.end_date = updatedTask.end_date;
            }
            if (updatedTask.start_date !== undefined) {
              task.start_date = updatedTask.start_date;
            }
          }
          if (state.selectedTask && state.selectedTask._id === taskId) {
            if (updatedTask.title !== undefined) {
              state.selectedTask.title = updatedTask.title;
            }
            if (updatedTask.description !== undefined) {
              state.selectedTask.description = updatedTask.description;
            }
            if (updatedTask.priority !== undefined) {
              state.selectedTask.priority = updatedTask.priority;
            }
            if (updatedTask.status !== undefined) {
              state.selectedTask.status = updatedTask.status;
            }
            if (updatedTask.end_date !== undefined) {
              state.selectedTask.end_date = updatedTask.end_date;
            }
            if (updatedTask.start_date !== undefined) {
              state.selectedTask.start_date = updatedTask.start_date;
            }
            if (updatedTask.status_list_id !== undefined) {
              if (typeof updatedTask.status_list_id === "object") {
                state.selectedTask.status_list_id = updatedTask.status_list_id;
              } else if (
                typeof state.selectedTask.status_list_id === "object"
              ) {
                state.selectedTask.status_list_id._id =
                  updatedTask.status_list_id;
              }
            }
          }

          break;
        }
      }
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
        state.loading = false;
        state.error = null;
        state.selectedTask = action.payload.data;
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

export const {
  addNewTask,
  clearTaskState,
  setSelectedTask,
  clearSelectedTask,
  updateTaskPosition,
  updateTaskInState,
} = taskSlice.actions;

export default taskSlice.reducer;
