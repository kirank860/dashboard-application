import { Socket } from 'socket.io-client';
import React from 'react';

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface Participant {
  id: string;
  username: string;
  // Add other participant properties as needed
}

export interface Room {
  id: string;
  name: string;
  type: 'private' | 'group';
  participants: Participant[];
  // Add other room properties as needed
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status?: 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  senderName?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'private' | 'group' | 'general';
  participants: string[];
  lastMessage?: Message;
  createdBy?: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface ChatContextType {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messages: Message[];
  setCurrentRoom: (room: ChatRoom) => void;
  sendMessage: (content: string, type: Message['type'], fileUrl?: string) => void;
  createRoom: (name: string, type: 'private' | 'group', participants: string[]) => void;
  deleteRoom: (roomId: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  deleteMessage: (messageId: string) => void;
}

export interface SocketContextType {
  socket: typeof Socket | null;
  isConnected: boolean;
}

export interface HttpError {
  status: number;
  message: string;
  details?: any;
}

export interface NotificationState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
} 