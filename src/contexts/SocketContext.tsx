import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socketService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SocketContextType {
  isConnected: boolean;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
  url: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, url }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { currentUser } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // Connect to socket
    socketService.connect(url);

    // Set up connection status listener
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);

    // Cleanup on unmount
    return () => {
      socketService.off('connect');
      socketService.off('disconnect');
      socketService.disconnect();
    };
  }, [url]);

  // Update user ID when it changes
  useEffect(() => {
    if (currentUser?.id) {
      socketService.setUserId(currentUser.id);
    }
  }, [currentUser?.id]);

  const value = {
    isConnected,
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 