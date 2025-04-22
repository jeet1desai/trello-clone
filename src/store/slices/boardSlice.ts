import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { boardService } from "../../services/boardService";

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
  members: IMember[];
  createdAt: string;
  updatedAt: string;
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
}

export interface MemberData {
  _id: string;
  memberId: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  role: "ADMIN" | "MEMBER";
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

interface Notification {
  _id: string;
  message: string;
  action: string;
  read: boolean;
  receiver: string;
  sender: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
}


interface BoardState {
  boards: IBoard[];
  selectedBoard: IBoardDetails | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  addError: string | null;
  editError: string | null;
  invitedMemberList: MemberData[];
  invitedMemberDetail: InvitationMember | null;
}

const initialState: BoardState = {
  boards: [],
  selectedBoard: null,
  loading: false,
  error: null,
  success: null,
  addError: null,
  editError: null,
  invitedMemberList: [],
  invitedMemberDetail: null,
};

export const getAllBoards = createAsyncThunk(
  "board/get-all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await boardService.getAllBoards();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching boards."
      );
    }
  }
);

export const getBoardById = createAsyncThunk(
  "board/get-board-by-id",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await boardService.getBoardById(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching board details."
      );
    }
  }
);

export const addNewBoard = createAsyncThunk(
  "board/add",
  async (
    {
      name,
      description,
      workspace,
      members,
    }: {
      name: string;
      description: string;
      workspace: string;
      members: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.addNewBoard(
        name,
        description,
        workspace,
        members
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while adding board."
      );
    }
  }
);

export const editBoard = createAsyncThunk(
  "board/edit",
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
      description: string;
      workspace: string;
      members: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.editBoard(
        _id,
        name,
        description,
        workspace,
        members
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while updating board."
      );
    }
  }
);

export const deleteBoard = createAsyncThunk(
  "board/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await boardService.deleteBoard(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while deleting board."
      );
    }
  }
);

export const getBoardMemberListById = createAsyncThunk(
  "status/member-list",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await boardService.getBoardMemberListById(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching members"
      );
    }
  }
);

export const removeBoardMemberFromListById = createAsyncThunk(
  "status/remove-member",
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
      const response = await boardService.removeBoardMemberFromListById(
        _id,
        memberId
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while removing members."
      );
    }
  }
);

export const inviteBoardMember = createAsyncThunk(
  "invite/send-invitation",
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
      return rejectWithValue(
        error.response?.data?.message || "Error while sending invitation."
      );
    }
  }
);

export const getInvitationDetailsById = createAsyncThunk(
  "invite/invite-details",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await boardService.getInvitationDetailsById(_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching members"
      );
    }
  }
);

export const updateInvitationMemberById = createAsyncThunk(
  "invite/update-invitation",
  async (
    {
      _id,
      status
    }: {
      _id: string;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.updateInvitationDetailsById(_id, { status });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error while fetching members"
      );
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
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
        state.boards = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Boards fetched successfully.";
      })
      .addCase(getAllBoards.rejected, (state, action) => {
        state.loading = false;
        state.boards = [];
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching boards.";
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
        state.success = "Board details fetched successfully.";
      })
      .addCase(getBoardById.rejected, (state, action) => {
        state.loading = false;
        state.selectedBoard = null;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching board details.";
      })

      // Add board
      .addCase(addNewBoard.pending, (state) => {
        state.loading = true;
        state.addError = null;
        state.error = null;
        state.success = null;
      })
      .addCase(addNewBoard.fulfilled, (state, action) => {
        const {
          _id,
          name,
          description,
          createdBy,
          workspace,
          createdAt,
          updatedAt,
          members,
        } = action.payload.data;
        const currentWorkspace = {
          _id: _id,
          name,
          description,
          createdBy,
          workspace,
          createdAt,
          updatedAt,
          members,
        };
        state.boards = [...state.boards, currentWorkspace];
        state.loading = false;
        state.addError = null;
        state.error = null;
        state.success = "Board added successfully.";
      })
      .addCase(addNewBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.addError =
          (action.payload as string) || "Error while adding board.";
        state.error = (action.payload as string) || "Error while adding board.";
      })

      // Edit board
      .addCase(editBoard.pending, (state) => {
        state.loading = true;
        state.editError = null;
        state.error = null;
        state.success = null;
      })
      .addCase(editBoard.fulfilled, (state, action) => {
        const { _id, name, description, workspaceId, updatedAt } =
          action.payload.data;
        const currentWorkspace = {
          _id,
          name,
          description,
          workspaceId,
          updatedAt,
        };
        const index = state.boards.findIndex(
          (board) => board._id === currentWorkspace._id
        );
        if (index !== -1) {
          state.loading = false;
          state.editError = null;
          state.boards[index] = {
            ...state.boards[index],
            ...currentWorkspace,
            workspace: {
              ...state.boards[index].workspace,
              _id: currentWorkspace.workspaceId,
            },
          };
          state.error = null;
          state.success = "Board updated successfully.";
        } else {
          state.loading = false;
          state.editError = "Board not found.";
          state.error = "Board not found.";
        }
      })
      .addCase(editBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.editError =
          (action.payload as string) || "Error while updating board.";
        state.error =
          (action.payload as string) || "Error while updating board.";
      })

      // Delete board
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.boards.findIndex((board) => board._id === _id);
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.boards.splice(index, 1);
          state.success = "Board deleted successfully.";
        } else {
          state.loading = false;
          state.error = "Board not found.";
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching board.";
      })

      // Get board member list
      .addCase(getBoardMemberListById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getBoardMemberListById.fulfilled, (state, action) => {
        state.invitedMemberList = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Members fetched successfully.";
      })
      .addCase(getBoardMemberListById.rejected, (state, action) => {
        state.loading = false;
        state.invitedMemberList = [];
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching members.";
      })

      // Delete invited member from board
      .addCase(removeBoardMemberFromListById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(removeBoardMemberFromListById.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const index = state.boards.findIndex(
          (invitedMemberList) => invitedMemberList._id === _id
        );
        state.invitedMemberList = state.invitedMemberList.filter(
          (item) => item._id !== _id
        );
        if (index !== -1) {
          state.loading = false;
          state.error = null;
          state.success = "Member removed successfully.";
        } else {
          state.loading = false;
          state.error = "Member not found.";
        }
      })
      .addCase(removeBoardMemberFromListById.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while removing member.";
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
        state.success = "Invitation sent successfully.";
      })
      .addCase(inviteBoardMember.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while sending invitation.";
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
        state.success = "Invitation details fetched successfully.";
      })
      .addCase(getInvitationDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.invitedMemberDetail = null;
        state.success = null;
        state.error =
          (action.payload as string) || "Error while fetching invitation detail.";
      })
      
      // update invitation
      .addCase(updateInvitationMemberById.pending, (state) => {
        state.loading = true;
        state.editError = null;
        state.error = null;
        state.success = null;
      })
      .addCase(updateInvitationMemberById.fulfilled, (state, action) => {
        const { _id } = action.payload;
        state.loading = false;
        state.error = null;
        state.success = "Invitation accepted successfully.";
      })
      .addCase(updateInvitationMemberById.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.editError =
          (action.payload as string) || "Error while accepting invitation.";
        state.error =
          (action.payload as string) || "Error while accepting invitation.";
      });
  },
});

export const { openBoardAddModal, clearSelectedBoard } = boardSlice.actions;

export default boardSlice.reducer;
