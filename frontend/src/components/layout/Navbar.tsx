import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container,
  Typography,
  Divider,
  ListItemIcon,
  Fab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Mail as MailIcon,
  Drafts as DraftsIcon,
  VideoLibrary,
  Event as EventIcon,
  Photo,
  Podcasts,
  Info,
  AccountCircle,
  Store,
  ExitToApp,
  AdminPanelSettings,
  BugReport,
  Group,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthApi, GeneralNotificationInfoDto, NotificationDto, SystemNotificationApi, UserApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import * as toastr from 'toastr';
import Logo from '../../assets/128982_logo.png';
import UserSearchBar from './UserSearchBar';
import InviteIntegrantsModal from './InviteIntegrantsModal';
import PopoverNotifications from './PopoverNotifications';
import ViewInviteModal from './ViewInviteModal';

const Navbar = () => {
  const authService = new AuthApi(ApiConfiguration);
  const userService = new UserApi(ApiConfiguration);
  const systemNotificationService = new SystemNotificationApi(ApiConfiguration);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isBand } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<GeneralNotificationInfoDto>({ totalCount: 0, notifications: [] });
  const [profileSrc, setProfileSrc] = useState({
    userId: 0,
    profilePicture: "",
    nickname: "",
    profileBanner: ""
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElAvatar, setAnchorElAvatar] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLButtonElement>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [viewInviteModalOpen, setViewInviteModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationDto | undefined>(undefined);

  const notAllowedPaths = [
    "/",
    "/welcome",
    "/register",
    "/bandRegister",
    "/security/resetPassword",
    "/newAvatar",
    "/presentation"
  ];

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvatar(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorElAvatar(null);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  const logout = async () => {
    const result = await authService.apiAuthLogoutGet();
    if (result.isSuccess) {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      navigate('/');
    } else {
      toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderAvatar = () => {
    if (profileSrc.profilePicture) {
      return (
        <Avatar
          src={profileSrc.profilePicture}
          onClick={handleAvatarClick}
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            cursor: 'pointer',
            border: '2px solid',
            borderColor: 'primary.main'
          }}
        />
      );
    } else {
      return (
        <Avatar
          onClick={handleAvatarClick}
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            backgroundColor: getRandomColor(),
            cursor: 'pointer',
            border: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          {profileSrc.nickname.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
  };

  const getAvatarToNavbar = async () => {
    const result = await userService.apiUserGetUserInfoGet();
    if (result.isSuccess) {
      setProfileSrc({
        userId: result.data?.id!,
        profilePicture: result.data!.profilePicture!,
        nickname: result.data!.nickname!,
        profileBanner: result.data!.profileBanner || ""
      });
    } else {
      toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    }
  };

  const getNotifications = async () => {
    const result = await systemNotificationService.apiSystemNotificationGetAllNotificationByUserGet();
    if (result.isSuccess) {
      setNotifications(result.data!);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (notAllowedPaths.includes(currentPath)) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
      getAvatarToNavbar();
      getNotifications();
    }
  }, [location]);

  const menuItems = [
    { text: 'Vídeos', path: '/videos', icon: <VideoLibrary /> },
    { text: 'Fotos', path: '/photos', icon: <Photo /> },
    { text: 'Eventos', path: '/events', icon: <EventIcon /> },
    { text: 'Podcasts', path: '/podcasts', icon: <Podcasts /> },
    { text: 'Sobre mim', path: '/aboutMe', icon: <Info /> },
    { text: 'Loja Parceira', path: '/partnerStore', icon: <Store /> },
  ];

  const profileMenuItems = [
    { text: 'Minha Conta', path: '/myAccount', icon: <AccountCircle /> },
    { text: 'Meu Perfil', path: `/profile/${profileSrc.nickname}/${profileSrc.userId}`, icon: <AccountCircle /> },
    { text: 'Meus Vídeos', path: '/myVideos', icon: <VideoLibrary /> },
    { text: 'Minhas Fotos', path: '/myPhotos', icon: <Photo /> },
    { text: 'Reportar Problema', path: '/issueReport', icon: <BugReport /> },
  ];

  if (!showNavbar) return null;

  return (
    <>
      <AppBar position="fixed" elevation={4} sx={{ borderRadius: 0 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box
              component="img"
              src={Logo}
              alt="New Level Logo"
              onClick={() => navigate('/welcome')}
              sx={{
                height: { xs: 32, sm: 40 },
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />

            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Typography
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.text}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: "25%" }}>
              {/* Search Bar - Desktop */}
              {!isMobile && (
                <UserSearchBar />
              )}
              {/* Notifications */}
              <IconButton
                onClick={handleNotificationsClick}
                sx={{ color: 'white' }}
              >
                <Badge badgeContent={notifications.totalCount} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>

              {/* Avatar */}
              {renderAvatar()}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={toggleDrawer(true)}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: 280, sm: 320 },
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <Divider />
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={toggleDrawer(false)}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {profileMenuItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={toggleDrawer(false)}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}

          {isBand() && (
            <ListItem
              onClick={() => {
                setDrawerOpen(false);
                setInviteModalOpen(true);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                cursor: 'pointer'
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <Group />
              </ListItemIcon>
              <ListItemText primary="Integrantes" />
            </ListItem>
          )}

          {isAdmin() && (
            <ListItem
              component={Link}
              to="/acceptContent"
              onClick={toggleDrawer(false)}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'secondary.main' }}>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary="Pedidos (Admin)" />
            </ListItem>
          )}

          <ListItem
            onClick={() => {
              toggleDrawer(false);
              logout();
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>
      </Drawer>

      {/* Avatar Menu */}
      <Menu
        anchorEl={anchorElAvatar}
        open={Boolean(anchorElAvatar)}
        onClose={handleAvatarClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {profileMenuItems.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleAvatarClose}
            sx={{ color: 'text.primary', textDecoration: 'none' }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            {item.text}
          </MenuItem>
        ))}

        {isBand() && (
          <MenuItem
            onClick={() => {
              handleAvatarClose();
              setInviteModalOpen(true);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              <Group />
            </ListItemIcon>
            Integrantes
          </MenuItem>
        )}

        {isAdmin() && (
          <MenuItem
            component={Link}
            to="/acceptContent"
            onClick={handleAvatarClose}
            sx={{ color: 'text.primary', textDecoration: 'none' }}
          >
            <ListItemIcon sx={{ color: 'secondary.main' }}>
              <AdminPanelSettings />
            </ListItemIcon>
            Pedidos (Admin)
          </MenuItem>
        )}

        <Divider />
        <MenuItem
          onClick={() => {
            handleAvatarClose();
            logout();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <ExitToApp />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>

      {/* Notifications Popover */}
      <PopoverNotifications
        anchorEl={anchorElNotifications}
        notificationList={notifications.notifications}
        open={Boolean(anchorElNotifications)}
        onClose={handleNotificationsClose}
        onOpenInviteModal={() => setViewInviteModalOpen(true)}
        updateNotifications={getNotifications}
        getNotification={(notification) => setSelectedNotification(notification)}
      />

      {/* Invite Integrantes Modal */}
      {inviteModalOpen &&
        (<InviteIntegrantsModal
          open={inviteModalOpen}
          title="Gerenciar Integrantes da Banda"
          onClose={() => setInviteModalOpen(false)}
        />)}

      {/* View Invite Modal */}
      <ViewInviteModal
        open={viewInviteModalOpen}
        notification={selectedNotification}
        onClose={() => {
          setViewInviteModalOpen(false);
          setSelectedNotification(undefined);
          getNotifications(); // Refresh notifications after accepting/declining
        }}
      />
      {/* Spacer for fixed navbar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
