import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { Room } from '../types';

export const ChatSidebar = () => {
  const { user } = useAuth();
  const { currentRoom, setCurrentRoom } = useChat();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // Initialize with default rooms
    const defaultRooms: Room[] = [
      {
        id: 'general',
        name: 'General',
        type: 'group',
        participants: [
          { id: 'admin', username: 'Admin' },
          { id: user?.id || 'user', username: user?.username || 'User' }
        ]
      },
      {
        id: 'private-1',
        name: 'Private Chat',
        type: 'private',
        participants: [
          { id: user?.id || 'user', username: user?.username || 'User' },
          { id: 'other-user', username: 'John Doe' }
        ]
      }
    ];
    setRooms(defaultRooms);

    // Set initial room if none selected
    if (!currentRoom) {
      setCurrentRoom(defaultRooms[0]);
    }
  }, [user, setCurrentRoom, currentRoom]);

  const handleRoomSelect = (room: Room) => {
    setCurrentRoom(room);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#fff' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chats
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          New Chat
        </Button>
      </Box>
      <Divider />
      <List sx={{ p: 2 }}>
        {rooms.map((room) => (
          <ListItemButton
            key={room.id}
            selected={currentRoom?.id === room.id}
            onClick={() => handleRoomSelect(room)}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter'
                }
              }
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: room.type === 'group' ? 'secondary.main' : 'primary.main'
                }}
              >
                {room.name.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={room.name}
              secondary={room.type === 'group' ? 'Group Chat' : 'Private Chat'}
              primaryTypographyProps={{
                fontWeight: 600,
                color: 'text.primary'
              }}
              secondaryTypographyProps={{
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}; 