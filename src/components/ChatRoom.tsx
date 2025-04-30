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
import { Message } from '../types';
import { keyframes } from '@mui/system';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (message.trim() || file) {
      if (file) {
        setIsUploading(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const fileUrl = URL.createObjectURL(file);
          sendMessage(file.name, file.type.startsWith('image/') ? 'image' : 'file', fileUrl);
          setFile(null);
        } finally {
          setIsUploading(false);
        }
      }
      if (message.trim()) {
        sendMessage(message, 'text');
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
        height: { xs: '100%', md: 'calc(100vh - 100px)' },
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1, sm: 2 },
        gap: { xs: 1, sm: 2 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'grey.50',
        mt: { xs: 0, md: '100px' },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: currentRoom?.type === 'group' ? 'secondary.main' : 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            {currentRoom?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {currentRoom?.name || 'Select a room'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              {currentRoom?.type === 'group' ? 'Group Chat' : 'Private Chat'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          px: { xs: 1, sm: 2 },
          mx: -1,
          scrollBehavior: 'smooth',
          mb: { xs: 2, sm: 3 },
          maxHeight: { xs: '100%', md: 'calc(100vh - 300px)' },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
        }}
      >
        <List sx={{ py: 0 }}>
          {roomMessages.map((msg, index) => {
            // Consider all messages as sent by the current user for now
            const isSentByMe = true; // This will make all messages appear on the right

            return (
              <Zoom in key={msg.id} style={{ transitionDelay: `${index * 50}ms` }}>
                <ListItem
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end', // Always align to the right
                    justifyContent: 'flex-end',
                    py: { xs: 0.5, sm: 1 },
                    px: 2,
                    width: '100%',
                    animation: `${messageAnimation} 0.3s ease-out`,
                    position: 'relative',
                    '&:hover .message-options': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: { xs: '90%', sm: '75%', md: '65%' },
                      bgcolor: '#1976d2', // Always use blue background
                      color: 'white', // Always use white text
                      borderRadius: '20px 20px 4px 20px',
                      p: { xs: 1.5, sm: 2 },
                      position: 'relative',
                      boxShadow: theme.shadows[1],
                      transition: 'all 0.2s',
                      animation: `${bubbleAnimation} 0.3s ease-out`,
                      marginLeft: 'auto', // Push to the right
                      marginRight: '0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[3],
                      },
                    }}
                  >
                    {msg.type === 'text' ? (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          wordBreak: 'break-word',
                          fontSize: { xs: '0.95rem', sm: '1.1rem' },
                          fontWeight: 400,
                          letterSpacing: '0.2px',
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.content}
                      </Typography>
                    ) : msg.type === 'image' ? (
                      <Box sx={{ maxWidth: '100%' }}>
                        <Box
                          component="img"
                          src={msg.fileUrl}
                          alt={msg.content}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: { xs: 200, sm: 300 },
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.02)',
                            },
                          }}
                          onClick={() => window.open(msg.fileUrl, '_blank')}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            mt: 1, 
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }}
                        >
                          {msg.content}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <FileIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body2" 
                            noWrap
                            sx={{
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            }}
                          >
                            {msg.content}
                          </Typography>
                          <Typography
                            component="a"
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="caption"
                            sx={{
                              color: 'inherit',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mt: 0.5,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Download
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        mt: 0.5,
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                          color: 'inherit',
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      {isSentByMe && (
                        <>
                          <DoneAllIcon sx={{ 
                            fontSize: '14px', 
                            opacity: 0.7,
                            color: 'inherit'
                          }} />
                          <IconButton
                            className="message-options"
                            size="small"
                            onClick={(e) => handleMessageMenuOpen(e, msg.id)}
                            sx={{
                              padding: '2px',
                              opacity: 0,
                              transition: 'all 0.2s',
                              color: 'inherit',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <MoreVertIcon sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              </Zoom>
            );
          })}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          transition: 'all 0.2s',
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          mt: 'auto',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:focus-within': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Tooltip title="Add emoji">
            <IconButton
              ref={emojiButtonRef}
              color="primary"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              sx={{
                mb: { xs: 0.5, sm: 1 },
                p: { xs: 1, sm: 1.5 },
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <EmojiIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Attach file">
            <span>
              <IconButton
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={!currentRoom || isUploading}
                sx={{
                  mb: { xs: 0.5, sm: 1 },
                  p: { xs: 1, sm: 1.5 },
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <AttachFileIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            </span>
          </Tooltip>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size={isMobile ? "small" : "medium"}
            placeholder={currentRoom ? 'Type a message...' : 'Select a room to start chatting'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!currentRoom || isUploading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                backgroundColor: 'background.paper',
                '& fieldset': {
                  borderWidth: '1px',
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                },
              },
            }}
          />
          <Tooltip title="Send message">
            <span>
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!currentRoom || (!message.trim() && !file) || isUploading}
                sx={{
                  mb: { xs: 0.5, sm: 1 },
                  p: { xs: 1, sm: 1.5 },
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: 'white',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: 'scale(1.1)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                }}
              >
                {isUploading ? (
                  <CircularProgress size={isMobile ? 20 : 24} color="inherit" />
                ) : (
                  <SendIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        {showEmojiPicker && (
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <Box
              sx={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                mb: 1,
                zIndex: 100,
                '& .EmojiPickerReact': {
                  '--epr-bg-color': 'rgba(255, 255, 255, 0.95)',
                  '--epr-category-label-bg-color': 'rgba(255, 255, 255, 0.95)',
                  '--epr-hover-bg-color': 'rgba(0, 0, 0, 0.05)',
                  borderColor: 'divider',
                  boxShadow: theme.shadows[3],
                },
              }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
                width={320}
                height={400}
              />
            </Box>
          </ClickAwayListener>
        )}
        {file && (
          <Fade in>
            <Box
              sx={{
                mt: { xs: 1, sm: 1.5 },
                p: { xs: 1, sm: 1.5 },
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                animation: `${messageAnimation} 0.3s ease-out`,
              }}
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              ) : (
                <FileIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              )}
              <Typography 
                variant="body2" 
                noWrap 
                sx={{ 
                  flex: 1,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                {file.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setFile(null)}
                sx={{
                  p: { xs: 0.5, sm: 1 },
                  '&:hover': {
                    color: 'error.main',
                  },
                }}
              >
                ✕
              </IconButton>
            </Box>
          </Fade>
        )}
      </Paper>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMessageMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 120,
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              fontSize: '0.875rem',
              py: 1,
            },
          },
        }}
      >
        <MenuItem onClick={handleDeleteMessage} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Unsend
        </MenuItem>
      </Menu>
    </Box>
  );
}; 