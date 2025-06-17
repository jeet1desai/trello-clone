import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { boardService } from '../../services/boardService';
import { IWorkspace, updateWorkspaceBoards } from './workspaceSlice';
import { Pagination } from './dashboardSlice';
import { workspaceService } from '../../services/workspaceService';
import { BOARD_BACKGROUND_TYPE } from '../../utils/enums/board';

export interface IMember {
  _id: string;
  role: string;
  user: IBoardUser;
}

export interface IBoard {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  workspace: {
    _id: string;
    name: string;
  };
  isFavorite: boolean;
  members: IMember[];
  createdAt: string;
  updatedAt: string;
}

export interface AllBoard {
  _id: string;
  name: string;
}

export interface IBoardOwner {
  _id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
}

export interface IBoardUser {
  _id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  profile_image: string;
}

export interface IBoardMember {
  _id: string;
  memberId: string;
  role: string;
  boardId: string;
  workspaceId: string;
  user: IBoardUser;
}

export interface IBoardWorkspace {
  _id: string;
  name: string;
  workspaceOwner: {
    _id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
  };
}

export interface ICardLabel {
  _id: string;
  text: string;
  color: string;
}

export interface ICard {
  _id: string;
  title: string;
  description?: string;
  labels: ICardLabel[];
  members: IBoardUser[];
  dueDate?: string;
  attachments: number;
  comments: number;
}

export interface IBoardDetails {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  boardOwner: IBoardOwner;
  members: IBoardMember[];
  workspace: IBoardWorkspace[];
  background: string;
  backgroundType: BOARD_BACKGROUND_TYPE;
}

export interface IMemberId {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface MemberData {
  _id: string;
  memberId: IMemberId;
  role: 'ADMIN' | 'MEMBER';
  boardId: {
    _id: string;
    name: string;
  };
  workspaceId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface InvitationMember {
  _id: string;
  email: string;
  boardId: {
    _id: string;
    name: string;
  };
  invitedBy: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  workspaceId: {
    _id: string;
    name: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  role: 'MEMBER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ILabel {
  _id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  boardId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Background {
  _id: string;
  imageId: string;
  imageName: string;
  imageUrl: string;
}

export interface UserBackground {
  imageName: string;
  imageId: string;
  imageUrl: string;
  userId: string;
  _id: string;
  __v: number;
}

interface ITaskMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Analytics {
  averageSpendHours: number;
  mostEffective: string;
  leastEffective: string;
  usersList: AnalyticsUsersList[];
}

export interface AnalyticsUsersList {
  name: string;
  completedTasks: number;
  spendHours: number;
  estimatedHours: number;
}

interface BoardState {
  boards: IBoard[];
  boardLabels: ILabel[];
  selectedTaskMembers: ITaskMember[];
  searchTaskMembers: ITaskMember[];
  selectedTaskLabels: ILabel[];
  selectedBoard: IBoardDetails | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  addError: string | null;
  editError: string | null;
  invitedMemberList: MemberData[];
  invitedSearchMemberList: MemberData[];
  invitedMemberDetail: InvitationMember | null;
  boardPagination: Pagination;
  boardWorkspaces: IWorkspace[];
  boardWorkspacesPagination: Pagination;
  background: Background[];
  userBackround: UserBackground[];
  analytics: Analytics | null;
  allBoard: AllBoard[];
}

const initialState: BoardState = {
  boards: [],
  boardLabels: [],
  selectedTaskMembers: [],
  searchTaskMembers: [],
  selectedTaskLabels: [],
  selectedBoard: null,
  loading: false,
  error: null,
  success: null,
  addError: null,
  editError: null,
  invitedMemberList: [],
  invitedSearchMemberList: [],
  invitedMemberDetail: null,
  boardPagination: {
    currentPage: 0,
    limit: 0,
    totalPages: 0,
    totalRecords: 0,
  },
  boardWorkspaces: [],
  boardWorkspacesPagination: {
    currentPage: 0,
    limit: 0,
    totalPages: 0,
    totalRecords: 0,
  },
  background: [],
  userBackround: [],
  analytics: null,
  allBoard: [],
};

export const getAllBoards = createAsyncThunk(
  'task/get-all',
  async (
    {
      page,
      search,
      sortType,
    }: {
      page: number;
      search: string;
      sortType: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.getAllBoards(page, search, sortType);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching boards.');
    }
  }
);

export const getBoardById = createAsyncThunk('task/get-board-by-id', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await boardService.getBoardById(_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching board details.');
  }
});

export const addNewBoard = createAsyncThunk(
  'board/add',
  async (
    {
      name,
      description,
      workspace,
      members,
    }: {
      name: string;
      description?: string;
      workspace: string;
      members?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.addNewBoard(name, workspace, description, members);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while adding board.');
    }
  }
);

export const editBoard = createAsyncThunk(
  'board/edit',
  async (
    {
      _id,
      name,
      description,
      workspace,
      members,
    }: {
      _id: string;
      name: string;
      description?: string;
      workspace: string;
      members?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.editBoard(_id, name, workspace, description, members);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while updating board.');
    }
  }
);

export const deleteBoard = createAsyncThunk('board/delete', async (_id: string, { rejectWithValue, dispatch }) => {
  try {
    const response = await boardService.deleteBoard(_id);
    dispatch(updateWorkspaceBoards(response.data));
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while deleting board.');
  }
});

export const getBoardMemberListById = createAsyncThunk('status/member-list', async (data: { _id: string; search: string }, { rejectWithValue }) => {
  try {
    const response = await boardService.getBoardMemberListById(data._id, data.search);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching members');
  }
});

export const getBoardMemberListBySearchId = createAsyncThunk(
  'status/member-list-search',
  async (data: { _id: string; search: string }, { rejectWithValue }) => {
    try {
      const response = await boardService.getBoardMemberListById(data._id, data.search);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching members');
    }
  }
);

export const removeBoardMemberFromListById = createAsyncThunk(
  'member/remove-member',
  async (
    {
      _id,
      memberId,
    }: {
      _id: string;
      memberId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.removeBoardMemberFromListById(_id, memberId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while removing members.');
    }
  }
);

export const leaveBoard = createAsyncThunk('/member/leave-board', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await boardService.leaveBoard(_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while removing members.');
  }
});

export const inviteBoardMember = createAsyncThunk(
  'invite/send-invitation',
  async (
    {
      _id,
      members,
    }: {
      _id: string;
      members: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.inviteBoardMember(_id, members);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while sending invitation.');
    }
  }
);

export const getInvitationDetailsById = createAsyncThunk('invite/invite-details', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await boardService.getInvitationDetailsById(_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching members');
  }
});

export const updateInvitationMemberById = createAsyncThunk(
  'invite/update-invitation',
  async (
    {
      _id,
      status,
    }: {
      _id: string;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.updateInvitationDetailsById(_id, {
        status,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching members');
    }
  }
);

export const getAllLabels = createAsyncThunk('task/get-all-labels', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await boardService.getAllLabelsById(_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching labels.');
  }
});

export const addNewLabel = createAsyncThunk(
  'task/add-label',
  async (
    {
      name,
      board,
      background_color,
      text_color,
    }: {
      name: string;
      board: string;
      background_color: string;
      text_color: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.addNewLabel(name, board, background_color, text_color);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while adding label.');
    }
  }
);

export const editLabel = createAsyncThunk(
  'task/edit-label',
  async (
    {
      _id,
      name,
      background_color,
      text_color,
    }: {
      _id: string;
      name?: string;
      background_color?: string;
      text_color?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.editLabel(_id, name, background_color, text_color);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while updating label.');
    }
  }
);

export const deleteLabel = createAsyncThunk('task/delete-label', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await boardService.deleteLabel(_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while deleting label.');
  }
});

export const getLabelsByTaskId = createAsyncThunk('task/get-labels-by-task', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await boardService.getLabelsByTaskId(_id);
    return response.data?.map((labels: { label_id: string }) => labels.label_id);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching labels.');
  }
});

export const addLabelInTask = createAsyncThunk(
  'task/add-label-in-task',
  async (
    {
      task_id,
      label_id,
    }: {
      task_id: string;
      label_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.addLabelInTask(task_id, label_id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while adding label.');
    }
  }
);

export const removeLabelFromTask = createAsyncThunk(
  'task/remove-label-from-task',
  async ({ taskId, labelId }: { taskId: string; labelId: string }, { rejectWithValue }) => {
    try {
      const response = await boardService.removeLabelFromTask(taskId, labelId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while removing label.');
    }
  }
);

export const getMembersByTaskId = createAsyncThunk(
  'task/get-members-search-by-task',
  async (data: { _id: string; search: string }, { rejectWithValue }) => {
    try {
      const response = await boardService.getMembersByTaskId(data._id, data.search);
      return response.data?.map(
        (members: {
          member_id: {
            _id: string;
            first_name: string;
            last_name: string;
            email: string;
          };
        }) => {
          return {
            _id: members.member_id._id,
            first_name: members.member_id.first_name,
            last_name: members.member_id.last_name,
            email: members.member_id.email,
          };
        }
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching members.');
    }
  }
);

export const getMembersByTaskIdSearch = createAsyncThunk(
  'task/get-members-by-task',
  async (data: { _id: string; search: string }, { rejectWithValue }) => {
    try {
      const response = await boardService.getMembersByTaskId(data._id, data.search);
      return response.data?.map(
        (members: {
          member_id: {
            _id: string;
            first_name: string;
            last_name: string;
            email: string;
          };
        }) => {
          return {
            _id: members.member_id._id,
            first_name: members.member_id.first_name,
            last_name: members.member_id.last_name,
            email: members.member_id.email,
          };
        }
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching members.');
    }
  }
);

export const addMemberInTask = createAsyncThunk(
  'task/add-member-in-task',
  async (
    {
      task_id,
      member_id,
    }: {
      task_id: string;
      member_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.addMemberInTask(task_id, member_id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while adding member.');
    }
  }
);

export const removeMemberFromTask = createAsyncThunk(
  'task/remove-member-from-task',
  async ({ taskId, memberId }: { taskId: string; memberId: string }, { rejectWithValue }) => {
    try {
      const response = await boardService.removeMemberFromTask(taskId, memberId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while removing member.');
    }
  }
);

export const getWorkspacesForBoards = createAsyncThunk(
  'task/get-all-workspace',
  async (
    {
      page,
      search,
      sortType,
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
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching workspaces.');
    }
  }
);

export const duplicateTask = createAsyncThunk('task/duplicate-task', async ({ _id, title }: { _id: string; title: string }, { rejectWithValue }) => {
  try {
    const response = await boardService.duplicateTask(_id, title);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while duplicating task.');
  }
});

export const toggleFavorite = createAsyncThunk(
  'task/favorite',
  async (
    {
      boardId,
      isFavorite,
    }: {
      boardId: string;
      isFavorite: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.toggleFavorite(boardId, isFavorite);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while favourite board.');
    }
  }
);

export const getBackground = createAsyncThunk('board/backgrounds', async (_, { rejectWithValue }) => {
  try {
    const response = await boardService.getBackground();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching board background.');
  }
});

export const getUserBackground = createAsyncThunk('user/board/background/get', async (_, { rejectWithValue }) => {
  try {
    const response = await boardService.getUserBackground();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching board background.');
  }
});

export const postUserBackground = createAsyncThunk('user/board/background/post', async (uploadedImages: File[], { rejectWithValue }) => {
  try {
    const response = await boardService.postUserBackground(uploadedImages);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching board background.');
  }
});

export const deleteUserBackground = createAsyncThunk(
  'user/board/background/delete',
  async (
    {
      imageId,
      boardId,
    }: {
      imageId: string;
      boardId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.deleteUserBackground(imageId, boardId);
      if (response.message) {
        return { message: response.message, imageId };
      } else {
        return { message: 'Error', imageId: '' };
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while deleting board.');
    }
  }
);

export const changebackground = createAsyncThunk(
  'board/update-background',
  async (
    {
      boardId,
      backgroundType,
      background,
      imageId,
    }: {
      boardId: string;
      backgroundType: BOARD_BACKGROUND_TYPE;
      background: string;
      imageId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.changebackground(boardId, backgroundType, background, imageId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error while updating board.');
    }
  }
);

export const getAnalyticsData = createAsyncThunk('task/analytics', async (_id: string, { rejectWithValue }) => {
  try {
    const response = await boardService.getAnalyticsData(_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching data.');
  }
});

export const getAllBoardsNoPagination = createAsyncThunk('task/get-all-no-pagination', async (_, { rejectWithValue }) => {
  try {
    const response = await boardService.getAllBoardsNoPagination();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'Error while fetching boards.');
  }
});

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addSelectedMembers: (state, action) => {
      const { _id, first_name, last_name, email } = action.payload.data.member_id;
      state.selectedTaskMembers = [...state.selectedTaskMembers, { _id, first_name, last_name, email }];
    },
    removeSelectedMember: (state, action) => {
      const updatedMembers = state.selectedTaskMembers.filter((member) => member._id !== action.payload.data.member_id);
      state.selectedTaskMembers = updatedMembers;
    },
    addSelectedLabels: (state, action) => {
      const { _id, name, boardId, textColor, backgroundColor } = action.payload.data.label_id;
      state.selectedTaskLabels = [...state.selectedTaskLabels, { _id, name, boardId, textColor, backgroundColor }];
    },
    removeSelectedLabel: (state, action) => {
      const { label_id } = action.payload.data;
      state.selectedTaskLabels = state.selectedTaskLabels.filter((label) => label._id !== label_id);
    },
    openBoardAddModal: (state) => {
      state.addError = null;
      state.editError = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    clearSelectedBoard: (state) => {
      state.selectedBoard = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    addNewInvitedMember: (state, action) => {
      state.invitedMemberList = [...action.payload.data];
    },
    removeInvitedmember: (state, action) => {
      const { _id } = action.payload.data;
      state.invitedMemberList = state.invitedMemberList.filter((item) => item._id !== _id);
    },
    updateBackground: (state, action) => {
      const { background, backgroundType } = action.payload.data;
      if (state.selectedBoard) {
        state.selectedBoard = {
          ...state.selectedBoard,
          background: background,
          backgroundType: backgroundType,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //Get all boards
      .addCase(getAllBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getAllBoards.fulfilled, (state, action) => {
        const { boards, pagination } = action.payload;
        state.boards = boards;
        state.boardPagination = pagination;
        state.loading = false;
        state.error = null;
        state.success = 'Boards fetched successfully.';
      })
      .addCase(getAllBoards.rejected, (state, action) => {
        state.loading = false;
        state.boards = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching boards.';
      })

      // Fetch board details
      .addCase(getBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getBoardById.fulfilled, (state, action) => {
        state.selectedBoard = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Board details fetched successfully.';
      })
      .addCase(getBoardById.rejected, (state, action) => {
        state.loading = false;
        state.selectedBoard = null;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching board details.';
      })

      // Add board
      .addCase(addNewBoard.pending, (state) => {
        state.loading = true;
        state.addError = null;
        state.error = null;
        state.success = null;
      })
      .addCase(addNewBoard.fulfilled, (state) => {
        state.loading = false;
        state.addError = null;
        state.error = null;
        state.success = 'Board added successfully.';
      })
      .addCase(addNewBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.addError = (action.payload as string) || 'Error while adding board.';
        state.error = (action.payload as string) || 'Error while adding board.';
      })

      // Edit board
      .addCase(editBoard.pending, (state) => {
        state.loading = true;
        state.editError = null;
        state.error = null;
        state.success = null;
      })
      .addCase(editBoard.fulfilled, (state, action) => {
        const { _id, name, description, workspaceId, updatedAt } = action.payload.data;
        const currentWorkspace = {
          _id,
          name,
          description,
          workspaceId,
          updatedAt,
        };
        const index = state.boards?.findIndex((board) => board._id === currentWorkspace._id);
        if (index !== -1) {
          state.loading = false;
          state.editError = null;
          state.boards[index] = {
            ...state.boards?.[index],
            ...currentWorkspace,
            workspace: {
              ...state.boards?.[index].workspace,
              _id: currentWorkspace.workspaceId,
            },
          };
          state.error = null;
          state.success = 'Board updated successfully.';
        } else {
          state.loading = false;
          state.editError = 'Board not found.';
          state.error = 'Board not found.';
        }
      })
      .addCase(editBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.editError = (action.payload as string) || 'Error while updating board.';
        state.error = (action.payload as string) || 'Error while updating board.';
      })

      // Delete board
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.boards?.findIndex((board) => board._id === _id);
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.boards?.splice(index, 1);
          state.success = 'Board deleted successfully.';
        } else {
          state.loading = false;
          state.error = 'Board not found.';
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while deleting board.';
      })

      // Get board member list
      .addCase(getBoardMemberListById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getBoardMemberListById.fulfilled, (state, action) => {
        state.invitedMemberList = action.payload;
        state.invitedSearchMemberList = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Members fetched successfully.';
      })
      .addCase(getBoardMemberListById.rejected, (state, action) => {
        state.loading = false;
        state.invitedMemberList = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching members.';
      })

      // Get board member list
      .addCase(getBoardMemberListBySearchId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getBoardMemberListBySearchId.fulfilled, (state, action) => {
        state.invitedSearchMemberList = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Members fetched successfully.';
      })
      .addCase(getBoardMemberListBySearchId.rejected, (state, action) => {
        state.loading = false;
        state.invitedSearchMemberList = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching members.';
      })

      // Delete invited member from board
      .addCase(removeBoardMemberFromListById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(removeBoardMemberFromListById.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.boards?.findIndex((invitedMemberList) => invitedMemberList._id === _id);
        state.invitedMemberList = state.invitedMemberList.filter((item) => item._id !== _id);
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.success = 'Member removed successfully.';
        } else {
          state.loading = false;
          state.error = 'Member not found.';
        }
      })
      .addCase(removeBoardMemberFromListById.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while removing member.';
      })

      // Leave from board
      .addCase(leaveBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(leaveBoard.fulfilled, (state) => {
        state.loading = false;
        state.success = 'You have successfully exited the board.';
      })
      .addCase(leaveBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while leaving board.';
      })

      // send member invitation
      .addCase(inviteBoardMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(inviteBoardMember.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = 'Invitation sent successfully.';
      })
      .addCase(inviteBoardMember.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while sending invitation.';
      })

      // Get invited member details
      .addCase(getInvitationDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getInvitationDetailsById.fulfilled, (state, action) => {
        state.invitedMemberDetail = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Invitation details fetched successfully.';
      })
      .addCase(getInvitationDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.invitedMemberDetail = null;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching invitation detail.';
      })

      // update invitation
      .addCase(updateInvitationMemberById.pending, (state) => {
        state.loading = true;
        state.editError = null;
        state.error = null;
        state.success = null;
      })
      .addCase(updateInvitationMemberById.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = 'Invitation accepted successfully.';
      })
      .addCase(updateInvitationMemberById.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.editError = (action.payload as string) || 'Error while accepting invitation.';
        state.error = (action.payload as string) || 'Error while accepting invitation.';
      })

      // Get All Labels
      .addCase(getAllLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getAllLabels.fulfilled, (state, action) => {
        state.boardLabels = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Labels fetched successfully.';
      })
      .addCase(getAllLabels.rejected, (state, action) => {
        state.loading = false;
        state.boards = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching labels.';
      })

      // Add New Label
      .addCase(addNewLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addNewLabel.fulfilled, (state, action) => {
        const { _id, name, backgroundColor, textColor, createdBy, boardId, createdAt, updatedAt } = action.payload.data;
        const currentLabel = {
          _id,
          name,
          backgroundColor,
          textColor,
          createdBy,
          boardId,
          createdAt,
          updatedAt,
        };
        state.boardLabels = [...state.boardLabels, currentLabel];
        state.loading = false;
        state.error = null;
        state.success = 'Label added successfully.';
      })
      .addCase(addNewLabel.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while adding label.';
      })

      // Edit label
      .addCase(editLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(editLabel.fulfilled, (state, action) => {
        const { _id, name, backgroundColor, textColor } = action.payload.data;
        const currentLabel = {
          _id,
          name,
          backgroundColor,
          textColor,
        };
        const index = state.boardLabels.findIndex((label) => label._id === currentLabel._id);
        if (index !== -1) {
          state.loading = false;
          state.boardLabels[index] = {
            ...state.boardLabels[index],
            ...currentLabel,
          };
          state.error = null;
          state.success = 'Label updated successfully.';
        } else {
          state.loading = false;
          state.error = 'Label not found.';
        }
      })
      .addCase(editLabel.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while updating label.';
      })

      // Delete label
      .addCase(deleteLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteLabel.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.boardLabels.findIndex((label) => label._id === _id);
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.boardLabels.splice(index, 1);
          state.success = 'Label deleted successfully.';
        } else {
          state.loading = false;
          state.error = 'Label not found.';
        }
      })
      .addCase(deleteLabel.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while deleting label.';
      })

      // Get labels for task
      .addCase(getLabelsByTaskId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getLabelsByTaskId.fulfilled, (state, action) => {
        state.selectedTaskLabels = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Labels fetched successfully.';
      })
      .addCase(getLabelsByTaskId.rejected, (state, action) => {
        state.loading = false;
        state.boards = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching labels.';
      })

      // Add label into task
      .addCase(addLabelInTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addLabelInTask.fulfilled, (state, action) => {
        const { _id, name, backgroundColor, textColor, boardId } = action.payload.data.label_id;
        const { createdAt, updatedAt } = action.payload.data;
        const currentLabel = {
          _id,
          name,
          backgroundColor,
          textColor,
          boardId,
          createdAt,
          updatedAt,
        };
        const existingLabel = state.selectedTaskLabels.findIndex((label) => label._id === currentLabel._id);
        if (existingLabel === -1) {
          state.selectedTaskLabels = [...state.selectedTaskLabels, currentLabel];
        }
        state.loading = false;
        state.error = null;
        state.success = 'Label added successfully.';
      })
      .addCase(addLabelInTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while adding label.';
      })

      // remove label from task
      .addCase(removeLabelFromTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(removeLabelFromTask.fulfilled, (state, action) => {
        const { label_id } = action.payload;
        const index = state.selectedTaskLabels.findIndex((label) => label._id === label_id);
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.selectedTaskLabels.splice(index, 1);
          state.success = 'Label removed successfully.';
        } else {
          state.loading = false;
          state.error = 'Label not found.';
        }
      })
      .addCase(removeLabelFromTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while removing label.';
      })

      // Get members for task
      .addCase(getMembersByTaskId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getMembersByTaskId.fulfilled, (state, action) => {
        state.selectedTaskMembers = action.payload;
        state.searchTaskMembers = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Members fetched successfully.';
      })
      .addCase(getMembersByTaskId.rejected, (state, action) => {
        state.loading = false;
        state.boards = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching members.';
      })

      // Get Search members for task
      .addCase(getMembersByTaskIdSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getMembersByTaskIdSearch.fulfilled, (state, action) => {
        state.searchTaskMembers = action.payload;
        state.loading = false;
        state.error = null;
        state.success = 'Members fetched successfully.';
      })
      .addCase(getMembersByTaskIdSearch.rejected, (state, action) => {
        state.loading = false;
        state.boards = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching members.';
      })

      // Add member into task
      .addCase(addMemberInTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addMemberInTask.fulfilled, (state, action) => {
        const { _id, first_name, last_name, email } = action.payload.data.member_id;
        const currentMember = {
          _id,
          first_name,
          last_name,
          email,
        };
        const existingMember = state.selectedTaskMembers.findIndex((member) => member._id === currentMember._id);
        if (existingMember === -1) state.selectedTaskMembers = [...state.selectedTaskMembers, currentMember];
        state.loading = false;
        state.error = null;
        state.success = 'Member added successfully.';
      })
      .addCase(addMemberInTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while adding member.';
      })

      // remove member from task
      .addCase(removeMemberFromTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(removeMemberFromTask.fulfilled, (state, action) => {
        const { member_id } = action.payload;
        const index = state.selectedTaskMembers.findIndex((member) => member._id === member_id);
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.searchTaskMembers.splice(index, 1);
          state.success = 'Member removed successfully.';
        } else {
          state.loading = false;
          state.error = 'Member not found.';
        }
      })
      .addCase(removeMemberFromTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while removing member.';
      })

      // Workspaces for boards
      .addCase(getWorkspacesForBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getWorkspacesForBoards.fulfilled, (state, action) => {
        const { workspaces, pagination } = action.payload;
        state.boardWorkspaces = workspaces;
        state.boardWorkspacesPagination = pagination;
        state.loading = false;
        state.error = null;
        state.success = 'Workspace fetched successfully.';
      })
      .addCase(getWorkspacesForBoards.rejected, (state, action) => {
        state.loading = false;
        state.boardWorkspaces = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching workspaces.';
      })

      // duplicate ticket
      .addCase(duplicateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(duplicateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = 'Duplicate ticket created successfully.';
      })
      .addCase(duplicateTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching workspaces.';
      })

      // Board favourite
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.boards = state.boards?.map((item) =>
          item._id === action.payload.data.boardId
            ? {
              ...item,
              isFavorite: action.payload.data.isFavorite,
            }
            : item
        );
        state.loading = false;
        state.error = null;
        state.success = action.payload.message;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.boards = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching workspace.';
      })

      // Board favourite
      .addCase(getBackground.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getBackground.fulfilled, (state, action) => {
        state.background = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getBackground.rejected, (state, action) => {
        state.background = [];
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching board background.';
      })

      // Board get user background
      .addCase(getUserBackground.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUserBackground.fulfilled, (state, action) => {
        state.userBackround = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserBackground.rejected, (state, action) => {
        state.userBackround = [];
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching board background.';
      })

      // Board post user background
      .addCase(postUserBackground.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(postUserBackground.fulfilled, (state, action) => {
        state.userBackround = [...state.userBackround, ...action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(postUserBackground.rejected, (state, action) => {
        state.userBackround = [];
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching board background.';
      })

      // Delete invited member from board
      .addCase(deleteUserBackground.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteUserBackground.fulfilled, (state, action) => {
        const { message, imageId } = action.payload;
        if (imageId) {
          state.userBackround = state.userBackround.filter((item) => item._id !== imageId);
        }
        state.success = message;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUserBackground.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while removing member.';
      })

      // change user board background
      .addCase(changebackground.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changebackground.fulfilled, (state, action) => {
        if (state.selectedBoard) {
          state.selectedBoard = {
            ...state.selectedBoard,
            background: action?.payload?.background,
            backgroundType: action?.payload?.backgroundType,
          };
        }
        state.success = '';
        state.loading = false;
        state.error = null;
      })
      .addCase(changebackground.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while removing member.';
      })

      // get board analytics data
      .addCase(getAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getAnalyticsData.fulfilled, (state, action) => {
        state.analytics = action.payload;
        const { background, backgroundType } = action.payload.board;
        if (!state.selectedBoard) {
          state.selectedBoard = {
            background,
            backgroundType,
          } as IBoardDetails;
        } else {
          state.selectedBoard = {
            ...state.selectedBoard,
            background,
            backgroundType,
          };
        }
        state.success = '';
        state.loading = false;
        state.error = null;
      })
      .addCase(getAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching data.';
      })

      //Get all boards
      .addCase(getAllBoardsNoPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getAllBoardsNoPagination.fulfilled, (state, action) => {
        const { boards } = action.payload;
        const finalBoard = boards.map((item: IBoard) => ({
          _id: item._id,
          name: item.name,
        }));
        state.allBoard = finalBoard;
        state.loading = false;
        state.error = null;
        state.success = 'Boards fetched successfully.';
      })
      .addCase(getAllBoardsNoPagination.rejected, (state, action) => {
        state.loading = false;
        state.allBoard = [];
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching boards.';
      });
  },
});

export const {
  addSelectedMembers,
  removeSelectedMember,
  addSelectedLabels,
  removeSelectedLabel,
  openBoardAddModal,
  clearSelectedBoard,
  addNewInvitedMember,
  removeInvitedmember,
  updateBackground,
} = boardSlice.actions;

export default boardSlice.reducer;
