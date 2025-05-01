import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Room } from '../types';
import { useAuth } from './AuthContext';

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
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const { user } = useAuth();

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (message: Message) => {
    if (!currentRoom || !user) return;
    
    // Add the message to the local state
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