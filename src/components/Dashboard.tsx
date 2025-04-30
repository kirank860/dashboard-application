import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
  Container,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ChatSidebar } from './ChatSidebar';
import { ChatRoom } from './ChatRoom';
import { keyframes } from '@mui/system';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawerWidth = isSmall ? '100%' : 300;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh',
        bgcolor: 'background.default',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          background: `linear-gradient(-45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundSize: '200% 200%',
          animation: `${gradientAnimation} 15s ease infinite`,
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 2 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: { xs: 1, sm: 2 },
                  display: { md: 'none' },
                  '&:hover': { transform: 'rotate(180deg)', transition: 'transform 0.3s' },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                Chat Dashboard
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Typography
                variant="body1"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: 'white',
                  fontWeight: 500,
                }}
              >
                {user?.username}
              </Typography>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1.1rem' },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                TransitionComponent={Fade}
                sx={{
                  '& .MuiPaper-root': {
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow: theme.shadows[3],
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    '&:hover': {
                      bgcolor: 'primary.lighter',
                    },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { xs: '100%', md: drawerWidth },
          flexShrink: { md: 0 },
          zIndex: { xs: theme.zIndex.drawer + 2, md: theme.zIndex.drawer },
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              boxShadow: { xs: theme.shadows[8], md: 'none' },
              height: { xs: 'calc(100% - 56px)', sm: 'calc(100% - 64px)', md: '100%' },
              marginTop: { xs: '56px', sm: '64px', md: 0 },
            },
          }}
        >
          <Toolbar
            sx={{
              display: { xs: 'none', md: 'block' },
              background: `linear-gradient(-45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundSize: '200% 200%',
              animation: `${gradientAnimation} 15s ease infinite`,
            }}
          />
          <ChatSidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)', md: '100vh' },
          mt: { xs: '56px', sm: '64px', md: 0 },
          overflow: 'hidden',
          bgcolor: 'background.default',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at top right, ${theme.palette.primary.lighter} 0%, transparent 60%)`,
            opacity: 0.4,
            pointerEvents: 'none',
          },
        }}
      >
        <Toolbar sx={{ display: { xs: 'none', md: 'block' } }} />
        <ChatRoom />
      </Box>
    </Box>
  );
}; 