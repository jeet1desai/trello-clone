import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  starred?: boolean;
  archived?: boolean;
}

interface WorkspaceState {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [
    {
      id: '1',
      name: 'Marketing',
      description: 'Workspace for marketing team',
      created_by: 'user1',
      created_at: new Date().toISOString(),
      starred: false,
      archived: false
    },
    {
      id: '2',
      name: 'Engineering',
      description: 'Workspace for engineering team',
      created_by: 'user2',
      created_at: new Date().toISOString(),
      starred: true,
      archived: false
    },
    {
      id: '3',
      name: 'Design',
      description: 'Workspace for design team',
      created_by: 'user3',
      created_at: new Date().toISOString(),
      starred: false,
      archived: false
    }
  ],
  loading: false,
  error: null
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<Omit<Workspace, 'id' | 'created_at'>>) => {
      const newWorkspace = {
        ...action.payload,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        archived: false
      };
      state.workspaces.push(newWorkspace);
      message.success('Workspace created successfully');
    },
    editWorkspace: (state, action: PayloadAction<{ id: string; data: Partial<Omit<Workspace, 'id' | 'created_at' | 'created_by'>> }>) => {
      const { id, data } = action.payload;
      const index = state.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        state.workspaces[index] = {
          ...state.workspaces[index],
          ...data
        };
        message.success('Workspace updated successfully');
      } else {
        message.error('Workspace not found');
      }
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        state.workspaces.splice(index, 1);
        message.success('Workspace deleted successfully');
      } else {
        message.error('Workspace not found');
      }
    },
    toggleStarWorkspace: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        const currentStarred = !!state.workspaces[index].starred;
        state.workspaces[index].starred = !currentStarred;
        message.success(currentStarred 
          ? 'Workspace removed from starred' 
          : 'Workspace added to starred');
      } else {
        message.error('Workspace not found');
      }
    },
    archiveWorkspace: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        state.workspaces[index].archived = true;
        message.success('Workspace archived successfully');
      } else {
        message.error('Workspace not found');
      }
    },
    restoreWorkspace: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        state.workspaces[index].archived = false;
        message.success('Workspace restored successfully');
      } else {
        message.error('Workspace not found');
      }
    }
  }
});

export const { 
  addWorkspace, 
  editWorkspace, 
  deleteWorkspace,
  toggleStarWorkspace,
  archiveWorkspace,
  restoreWorkspace
} = workspaceSlice.actions;

export default workspaceSlice.reducer; 