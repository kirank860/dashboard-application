export interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'private';
  participants: string[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  roomId: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
} 