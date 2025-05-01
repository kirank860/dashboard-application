import { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  Tooltip,
  CircularProgress,
  useTheme,
  Fade,
  Zoom,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Popper,
  ClickAwayListener,
  LinearProgress,
  ListItemIcon,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { Message, Room } from '../types';
import { keyframes } from '@mui/system';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import FilePreview from './FilePreview';
import NotificationService from '../services/NotificationService';
import { useSocket } from '../contexts/SocketContext';

const messageAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bubbleAnimation = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

interface MessageStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'read';
}

export const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, currentRoom, sendMessage, setMessages } = useChat();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const { socket } = useSocket();
  const [uploadProgress, setUploadProgress] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message_status', ({ messageId, status }: MessageStatus) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg
          )
        );
      });

      socket.on('new_message', (message: Message) => {
        if (message.senderId !== user?.id) {
          NotificationService.notify(message, message.senderName || 'User');
        }
      });
    }
  }, [socket, user?.id]);

  const handleSend = async () => {
    if (message.trim() || file) {
      if (file) {
        setIsUploading(true);
        try {
          // Simulate file upload with progress
          for (let i = 0; i <= 100; i += 10) {
            setUploadProgress(i);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          
          const fileUrl = URL.createObjectURL(file);
          const newMessage: Message = {
            id: Date.now().toString(),
            content: file.name,
            senderId: user?.id || '',
            roomId: currentRoom?.id || '',
            timestamp: new Date(),
            type: file.type.startsWith('image/') ? 'image' : 'file',
            fileUrl,
            status: 'sent',
            senderName: user?.username
          };
          
          socket?.emit('send_message', newMessage);
          setMessages((prev) => [...prev, newMessage]);
          setFile(null);
          setUploadProgress(0);
        } finally {
          setIsUploading(false);
        }
      }
      
      if (message.trim()) {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: message.trim(),
          senderId: user?.id || '',
          roomId: currentRoom?.id || '',
          timestamp: new Date(),
          type: 'text',
          status: 'sent',
          senderName: user?.username
        };
        
        socket?.emit('send_message', newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleMessageMenuOpen = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedMessage(messageId);
  };

  const handleMessageMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      setMessages((prev: Message[]) => prev.filter((msg: Message) => msg.id !== selectedMessage));
      handleMessageMenuClose();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const roomMessages = messages.filter((m) => m.roomId === currentRoom?.id);

  return (
    <Box 
      sx={{ 
        height: { xs: '100vh', sm: 'calc(100vh - 100px)' },
        maxWidth: { xs: '100%', sm: '900px' },
        width: '100%',
        margin: { xs: 0, sm: '100px auto 0' },
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#fff',
        borderRadius: { xs: 0, sm: 2 },
        overflow: 'hidden',
        boxShadow: { xs: 'none', sm: '0 2px 12px rgba(0, 0, 0, 0.1)' },
        position: { xs: 'fixed', sm: 'relative' },
        top: { xs: 0, sm: 'auto' },
        left: { xs: 0, sm: 'auto' },
        right: { xs: 0, sm: 'auto' },
        bottom: { xs: 0, sm: 'auto' },
        zIndex: { xs: 1200, sm: 1 }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: { xs: 1210, sm: 2 },
          width: '100%',
          minHeight: { xs: '60px', sm: '70px' }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 },
          flex: 1,
          minWidth: 0
        }}>
          <Avatar
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              width: { xs: 35, sm: 40 },
              height: { xs: 35, sm: 40 },
              flexShrink: 0
            }}
          >
            {currentRoom?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ 
            minWidth: 0,
            flex: 1
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: { xs: 1.2, sm: 1.4 },
                mb: 0.5,
                color: 'white'
              }}
            >
              {currentRoom?.name || 'Select a room'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: 'rgba(255, 255, 255, 0.8)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {currentRoom?.type === 'group' 
                ? `Group Chat • ${currentRoom.participants?.length || 0} participants`
                : 'Private Chat'}
            </Typography>
          </Box>
        </Box>
        <Avatar 
          sx={{ 
            width: { xs: 35, sm: 40 }, 
            height: { xs: 35, sm: 40 },
            bgcolor: 'white',
            color: 'primary.main',
            ml: { xs: 1, sm: 2 },
            flexShrink: 0
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#E0E0E0',
            borderRadius: '3px',
          },
        }}
      >
        <List sx={{ width: '100%', p: 0 }}>
          {roomMessages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                p: { xs: 0.25, sm: 0.5 },
                maxWidth: '100%'
              }}
            >
              <Box
                sx={{
                  maxWidth: { xs: '90%', sm: '70%' },
                  position: 'relative',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    bgcolor: msg.senderId === user?.id ? 'primary.main' : '#f5f5f5',
                    color: msg.senderId === user?.id ? '#fff' : 'inherit',
                    borderRadius: msg.senderId === user?.id ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  }}
                >
                  {msg.type === 'text' && (
                    <Typography variant="body1">{msg.content}</Typography>
                  )}
                  
                  {msg.type === 'image' && (
                    <Box
                      component="img"
                      src={msg.fileUrl}
                      alt="Image"
                      sx={{
                        maxWidth: '100%',
                        borderRadius: 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => window.open(msg.fileUrl, '_blank')}
                    />
                  )}
                  
                  {msg.type === 'file' && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => window.open(msg.fileUrl, '_blank')}
                    >
                      <FileIcon fontSize="small" />
                      <Typography variant="body2">{msg.content}</Typography>
                    </Box>
                  )}
                  
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 0.5,
                      opacity: 0.7,
                      fontSize: '0.75rem',
                    }}
                  >
                    <Typography variant="caption">
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Typography>
                    {msg.senderId === user?.id && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {msg.status === 'sent' && <DoneIcon sx={{ fontSize: 12 }} />}
                        {msg.status === 'delivered' && <DoneAllIcon sx={{ fontSize: 12 }} />}
                        {msg.status === 'read' && (
                          <DoneAllIcon sx={{ fontSize: 12, color: '#34B7F1' }} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>

                <IconButton
                  size="small"
                  onClick={(e) => handleMessageMenuOpen(e, msg.id)}
                  sx={{
                    position: 'absolute',
                    right: msg.senderId === user?.id ? -30 : 'auto',
                    left: msg.senderId === user?.id ? 'auto' : -30,
                    top: 0,
                    opacity: 0,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* File Preview */}
      {file && (
        <Box sx={{ px: 2, pb: 2, width: '100%' }}>
          <FilePreview file={file} onRemove={() => setFile(null)} />
          {isUploading && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </Box>
      )}

      {/* Message Input */}
      <Box
        component="form"
        sx={{
          p: { xs: 1, sm: 2 },
          display: 'flex',
          gap: { xs: 0.5, sm: 1 },
          alignItems: 'flex-end',
          bgcolor: '#fff',
          borderTop: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          bottom: 0,
          width: '100%',
          zIndex: 1
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        
        <IconButton
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          ref={emojiButtonRef}
          size="small"
        >
          <EmojiIcon />
        </IconButton>
        
        <IconButton 
          onClick={() => fileInputRef.current?.click()}
          size="small"
        >
          <AttachFileIcon />
        </IconButton>
        
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#f5f5f5',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        
        <IconButton
          color="primary"
          disabled={isUploading || (!message.trim() && !file)}
          type="submit"
          size="small"
        >
          {isUploading ? (
            <CircularProgress size={20} />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </Box>

      {/* Emoji Picker */}
      <Popper
        open={showEmojiPicker}
        anchorEl={emojiButtonRef.current}
        placement="top-start"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
              <Box sx={{ bgcolor: '#fff', boxShadow: 2, borderRadius: 1 }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </Box>
            </ClickAwayListener>
          </Fade>
        )}
      </Popper>

      {/* Message Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMessageMenuClose}
      >
        <MenuItem onClick={handleDeleteMessage}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete Message
        </MenuItem>
      </Menu>
    </Box>
  );
}; 