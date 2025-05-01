import { createContext, useContext, useEffect, ReactNode } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message, SocketContextType } from '../types';

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SOCKET_URL = 'http://localhost:3000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: {
      userId: user?.id
    }
  });

  useEffect(() => {
    if (user) {
      socket.connect();

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });

      socket.on('new_message', (message: Message) => {
        window.dispatchEvent(new CustomEvent('new_message', { detail: message }));
      });

      socket.on('message_deleted', (messageId: string) => {
        window.dispatchEvent(new CustomEvent('message_deleted', { detail: messageId }));
      });
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_message');
      socket.off('message_deleted');
      socket.disconnect();
    };
  }, [user, socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected: socket.connected }}>
      {children}
    </SocketContext.Provider>
  );
}; 