import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

// Define the visibility type for boards
export type BoardVisibility = 'private' | 'public';

// Define the Board interface
export interface Board {
  id: string;
  name: string;
  description: string;
  workspace_id: string;
  owner: string;
  members: string[];
  visibility: BoardVisibility;
  created_at: string;
  archived?: boolean;
}

// Define the state shape
interface BoardState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

// Initial state with some example boards
const initialState: BoardState = {
  boards: [
    {
      id: '1',
      name: 'Marketing Campaign',
      description: 'Q2 Marketing Campaign Planning',
      workspace_id: '1', // Marketing workspace
      owner: 'user1',
      members: ['user1', 'user3'],
      visibility: 'public',
      created_at: new Date().toISOString(),
      archived: false
    },
    {
      id: '2',
      name: 'Website Redesign',
      description: 'Website redesign project board',
      workspace_id: '3', // Design workspace
      owner: 'user3',
      members: ['user1', 'user2', 'user3'],
      visibility: 'public',
      created_at: new Date().toISOString(),
      archived: false
    }
  ],
  loading: false,
  error: null
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // Add a new board
    addBoard: (state, action: PayloadAction<Omit<Board, 'id' | 'created_at'>>) => {
      const newBoard = {
        ...action.payload,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        archived: false
      };
      state.boards.push(newBoard);
      message.success('Board created successfully');
    },
    
    // Edit an existing board
    editBoard: (state, action: PayloadAction<{ id: string; data: Partial<Omit<Board, 'id' | 'created_at'>> }>) => {
      const { id, data } = action.payload;
      const index = state.boards.findIndex(board => board.id === id);
      if (index !== -1) {
        state.boards[index] = {
          ...state.boards[index],
          ...data
        };
        message.success('Board updated successfully');
      } else {
        message.error('Board not found');
      }
    },
    
    // Delete a board
    deleteBoard: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.boards.findIndex(board => board.id === id);
      if (index !== -1) {
        state.boards.splice(index, 1);
        message.success('Board deleted successfully');
      } else {
        message.error('Board not found');
      }
    },
    
    // Archive a board
    archiveBoard: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.boards.findIndex(board => board.id === id);
      if (index !== -1) {
        state.boards[index].archived = true;
        message.success('Board archived successfully');
      } else {
        message.error('Board not found');
      }
    },
    
    // Restore an archived board
    restoreBoard: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.boards.findIndex(board => board.id === id);
      if (index !== -1) {
        state.boards[index].archived = false;
        message.success('Board restored successfully');
      } else {
        message.error('Board not found');
      }
    },
    
    // Add a member to a board
    addBoardMember: (state, action: PayloadAction<{ boardId: string; memberId: string }>) => {
      const { boardId, memberId } = action.payload;
      const index = state.boards.findIndex(board => board.id === boardId);
      if (index !== -1) {
        // Check if member already exists
        if (!state.boards[index].members.includes(memberId)) {
          state.boards[index].members.push(memberId);
          message.success('Member added to board');
        } else {
          message.info('Member is already part of this board');
        }
      } else {
        message.error('Board not found');
      }
    },
    
    // Remove a member from a board
    removeBoardMember: (state, action: PayloadAction<{ boardId: string; memberId: string }>) => {
      const { boardId, memberId } = action.payload;
      const index = state.boards.findIndex(board => board.id === boardId);
      if (index !== -1) {
        state.boards[index].members = state.boards[index].members.filter(m => m !== memberId);
        message.success('Member removed from board');
      } else {
        message.error('Board not found');
      }
    }
  }
});

export const { 
  addBoard, 
  editBoard, 
  deleteBoard,
  archiveBoard,
  restoreBoard,
  addBoardMember,
  removeBoardMember
} = boardSlice.actions;

export default boardSlice.reducer; 