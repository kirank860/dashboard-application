import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

export const ChatSidebar = () => {
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'group' | 'private'>('group');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const { rooms, currentRoom, joinRoom, createRoom, deleteRoom, setRooms } = useChat();
  const { user } = useAuth();

  // Persist rooms in localStorage
  useEffect(() => {
    localStorage.setItem('chatRooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    const storedRooms = localStorage.getItem('chatRooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, [setRooms]);

  const handleCreateRoom = () => {
    if (newRoomName.trim() && user) {
      createRoom(newRoomName, newRoomType, newRoomType === 'private' ? [user.id] : ['all']);
      setNewRoomName('');
      setIsCreateRoomOpen(false);
    }
  };

  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete.id);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setIsCreateRoomOpen(true)}
          sx={{
            borderRadius: 2,
            py: 1,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          New Chat Room
        </Button>
      </Box>
      <Divider />
      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          '& .MuiListItemButton-root': {
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
          },
        }}
      >
        {rooms.map((room) => (
          <Box key={room.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemButton
              selected={currentRoom?.id === room.id}
              onClick={() => joinRoom(room.id)}
              sx={{
                flex: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                },
              }}
            >
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor: room.type === 'group' ? 'secondary.main' : 'primary.main',
                }}
              >
                {room.type === 'group' ? <GroupIcon /> : <PersonIcon />}
              </Avatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: currentRoom?.id === room.id ? 600 : 400,
                      color: 'text.primary',
                    }}
                  >
                    {room.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {room.type === 'group' ? 'Group Chat' : 'Private Chat'}
                  </Typography>
                }
              />
            </ListItemButton>
            <Tooltip title="Delete chat room">
              <IconButton
                color="error"
                onClick={() => handleDeleteClick(room)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Chat Room</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the chat?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Chat Room</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            type="text"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Room Type</InputLabel>
            <Select
              value={newRoomType}
              label="Room Type"
              onChange={(e) => setNewRoomType(e.target.value as 'group' | 'private')}
            >
              <MenuItem value="group">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon />
                  Group Chat
                </Box>
              </MenuItem>
              <MenuItem value="private">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Private Chat
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsCreateRoomOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateRoom}
            disabled={!newRoomName.trim()}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 