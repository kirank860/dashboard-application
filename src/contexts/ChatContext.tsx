import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Room } from '../types';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

interface ChatContextType {
  messages: Message[];
  currentRoom: Room | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (message: Message) => void;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ROOMS_STORAGE_KEY = 'chatRooms';
const MESSAGES_STORAGE_KEY = 'chatMessages';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on initial render
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const { user } = useAuth();
  const { socket } = useSocket();

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Listen for socket events
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent<Message>) => {
      setMessages((prev) => [...prev, event.detail]);
    };

    const handleMessageDeleted = (event: CustomEvent<string>) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== event.detail));
    };

    window.addEventListener('new_message', handleNewMessage as EventListener);
    window.addEventListener('message_deleted', handleMessageDeleted as EventListener);

    return () => {
      window.removeEventListener('new_message', handleNewMessage as EventListener);
      window.removeEventListener('message_deleted', handleMessageDeleted as EventListener);
    };
  }, []);

  const sendMessage = (message: Message) => {
    if (!currentRoom || !user || !socket) return;

    // Emit the message through socket
    socket.emit('send_message', message);
    
    // Optimistically add the message to the local state
    setMessages((prev) => [...prev, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, currentRoom, setMessages, sendMessage, setCurrentRoom }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 