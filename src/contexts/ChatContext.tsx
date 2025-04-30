import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, ChatRoom } from '../types';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

interface ChatContextType {
  messages: Message[];
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  sendMessage: (content: string, type: 'text' | 'image' | 'file', fileUrl?: string) => void;
  joinRoom: (roomId: string) => void;
  createRoom: (name: string, type: 'group' | 'private', participants: string[]) => void;
  deleteRoom: (roomId: string) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  deleteMessage: (messageId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ROOMS_STORAGE_KEY = 'chatRooms';
const MESSAGES_STORAGE_KEY = 'chatMessages';

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on initial render
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [rooms, setRooms] = useState<ChatRoom[]>(() => {
    // Load rooms from localStorage on initial render
    const savedRooms = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (savedRooms) {
      return JSON.parse(savedRooms);
    }
    // Default rooms if nothing in localStorage
    return [{
      id: '1',
      name: 'General',
      type: 'group',
      participants: ['all'],
    }];
  });
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const { user } = useAuth();
  const { socket } = useSocket();

  // Save rooms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

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

  const sendMessage = (content: string, type: 'text' | 'image' | 'file', fileUrl?: string) => {
    if (!currentRoom || !user || !socket) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      content,
      timestamp: new Date().toISOString(),
      type,
      fileUrl,
      roomId: currentRoom.id,
    };

    // Emit the message through socket
    socket.emit('send_message', message);
    
    // Optimistically add the message to the local state
    setMessages((prev) => [...prev, message]);
  };

  const deleteMessage = (messageId: string) => {
    if (!socket) return;
    
    // Emit delete event through socket
    socket.emit('delete_message', messageId);
    
    // Optimistically remove the message from local state
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const joinRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setCurrentRoom(room);
    }
  };

  const createRoom = (name: string, type: 'group' | 'private', participants: string[]) => {
    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      name,
      type,
      participants,
    };

    setRooms((prev) => [...prev, newRoom]);
  };

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    if (currentRoom && currentRoom.id === roomId) {
      setCurrentRoom(null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        rooms,
        currentRoom,
        sendMessage,
        joinRoom,
        createRoom,
        deleteRoom,
        setRooms,
        setMessages,
        deleteMessage,
      }}
    >
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