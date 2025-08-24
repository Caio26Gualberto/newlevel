import { Avatar, Badge, Box, Drawer, Grid, IconButton, Input, List, ListItem, Menu, MenuItem, styled, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "../../../assets/128982_logo.png"
import React from "react";
import { useAuth } from "../../../AuthContext";
import { AuthenticateApi, GeneralNotificationInfoDto, NotificationDto, SystemNotificationApi, UserApi } from "../../../gen/api/src";
import ApiConfiguration from "../../../apiConfig";
import * as toastr from 'toastr';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import InviteIntegrantsModal from "./InviteIntegrantsModal/InviteIntegrantsModal";
import PopoverNotifications from "./popoverNotifications/PopoverNotifications";
import ViewInviteModal from "./popoverNotifications/viewInviteModal/ViewInviteModal";
import DraftsIcon from '@mui/icons-material/Drafts';
import UserSearchBar from "./userSearchBar/UserSearchBar";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }
`;

const StyledLinkForAdmin = styled(Link)`
  text-decoration: none;
  color: pink;
  transition: color 0.3s ease;

  &:hover {
    color: pink;
  }
`;

const StyledMenu = styled(MenuItem)`
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }
`;

const Navbar = () => {
    const authService = new AuthenticateApi(ApiConfiguration)
    const userService = new UserApi(ApiConfiguration)
    const systemNotificationService = new SystemNotificationApi(ApiConfiguration)
    const navigate = useNavigate();
    const location = useLocation()
    const { isAdmin, isBand } = useAuth()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [showNavbar, setShowNavbar] = useState<boolean>(false)
    const [openIntegrantsInvite, setOpenIntegrantsInvite] = useState<boolean>(false)
    const [openIntegrantsAccept, setOpenIntegrantsAccept] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<GeneralNotificationInfoDto>({ totalCount: 0, notifications: [] })
    const [selectedInviteInfos, setSelectedInviteInfos] = React.useState<NotificationDto>({});
    const [profileSrc, setProfileSrc] = useState({
        userId: "",
        profilePicture: "",
        nickname: ""
    })
    const [anchorElPop, setAnchorElPop] = React.useState<HTMLButtonElement | null>(null);
    const [openPop, setOpenPop] = React.useState(false);

    const handleClickPop = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorElPop(event.currentTarget.parentElement as HTMLButtonElement);
        setOpenPop(true);
    };

    const handleClosePop = () => {
        setOpenPop(false);
        setAnchorElPop(null);
    };

    const handleGetNotification = (notification: NotificationDto) => {
        setSelectedInviteInfos(notification);
    }

    const handleOpenAcceptModal = () => {
        setOpenIntegrantsAccept(true);
    };

    const handleCloseAcceptModal = () => {
        setOpenIntegrantsAccept(false);
        getNotifications();
    };

    const handleClickOpen = () => {
        setOpenIntegrantsInvite(true);
    }

    const handleClickClose = () => {
        setOpenIntegrantsInvite(false);
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorElAvatar, setAnchorElAvatar] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openAvatar = Boolean(anchorElAvatar);

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open: any) => (event: any) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const notAllowedPaths = [
        "/",
        "/welcome",
        "/register",
        "/bandRegister",
        "/security/resetPassword",
        "/newAvatar"
    ];

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseAvatar = () => {
        setAnchorElAvatar(null);
    };

    const handleClickAvatar = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setAnchorElAvatar(event.currentTarget);
    };

    const logout = async () => {
        const result = await authService.apiAuthenticateLogoutGet()
        if (result.isSuccess) {
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('refreshToken');
            navigate('/')
        } else {
            toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }
    }

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const randomColor = getRandomColor();

    const rederizeAvatar = () => {
        if (profileSrc.profilePicture) {
            return (
                <Avatar 
                    component="a" 
                    sx={{ 
                        width: {
                            xs: 40,
                            sm: 45,
                            md: 50
                        }, 
                        height: {
                            xs: 40,
                            sm: 45,
                            md: 50
                        }
                    }} 
                    src={profileSrc.profilePicture} 
                    onClick={handleClickAvatar}
                />
            )
        } else {
            return (
                <Avatar 
                    component="a" 
                    onClick={handleClickAvatar} 
                    sx={{ 
                        width: {
                            xs: 40,
                            sm: 45,
                            md: 50
                        }, 
                        height: {
                            xs: 40,
                            sm: 45,
                            md: 50
                        }, 
                        backgroundColor: randomColor 
                    }}
                >
                    {(profileSrc as { nickname: string }).nickname.charAt(0)}
                </Avatar>
            )
        }
    }

    const getAvatarToNavbar = async () => {
        const result = await userService.apiUserGetUserInfoGet()
        if (result.isSuccess) {
            setProfileSrc({ userId: result.data?.id!, profilePicture: result.data!.profilePicture!, nickname: result.data!.nickname! })
        } else {
            toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }
    }

    const getNotifications = async () => {
        const result = await systemNotificationService.apiSystemNotificationGetAllNotificationByUserGet()
        if (result.isSuccess) {
            setNotifications(result.data!)
        }
    }

    useEffect(() => {
        const currentPath = location.pathname;
        if (notAllowedPaths.includes(currentPath)) {
            setShowNavbar(false)
        } else {
            setShowNavbar(true)
        }

        if (!notAllowedPaths.includes(currentPath)) {
            getAvatarToNavbar();
            getNotifications();
        }
    }
        , [location])

    return (
        <>{showNavbar &&
            <>
                {isBand() && <InviteIntegrantsModal onClose={handleClickClose} open={openIntegrantsInvite} title="Convide Membros" />}
                {isMobile ? (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                bgcolor: "black",
                                zIndex: 2,
                                position: "fixed",
                                width: "100%",
                                height: {
                                    xs: "60px",
                                    sm: "70px"
                                },
                                p: {
                                    xs: 1,
                                    sm: 2
                                }
                            }}
                        >
                            <Box
                                component="img"
                                onClick={() => navigate('/welcome')}
                                src={Logo}
                                sx={{ 
                                    cursor: "pointer",
                                    height: {
                                        xs: "30px",
                                        sm: "40px"
                                    }
                                }}
                            />
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{
                                    color: "white"
                                }}
                            >
                                <MenuIcon color="primary" />
                            </IconButton>
                        </Box>
                        <Drawer 
                            anchor="right" 
                            open={drawerOpen} 
                            onClose={toggleDrawer(false)}
                            sx={{
                                '& .MuiDrawer-paper': {
                                    width: {
                                        xs: 250,
                                        sm: 280
                                    }
                                }
                            }}
                        >
                            <Box
                                sx={{ 
                                    width: "100%",
                                    height: "100%"
                                }}
                                role="presentation"
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                                bgcolor="black"
                            >
                                <List>
                                    <StyledLink to="/videos">
                                        <ListItem 
                                            button
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Vídeos
                                        </ListItem>
                                    </StyledLink>
                                    <StyledLink to="/photos">
                                        <ListItem 
                                            button
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Fotos
                                        </ListItem>
                                    </StyledLink>
                                    <StyledLink to="/podcasts">
                                        <ListItem 
                                            button
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Podcasts
                                        </ListItem>
                                    </StyledLink>
                                    <StyledLink to="/aboutMe">
                                        <ListItem 
                                            button
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Sobre mim
                                        </ListItem>
                                    </StyledLink>
                                    <StyledLink to="/myAccount">
                                        <ListItem
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Minha Conta
                                        </ListItem>
                                    </StyledLink>
                                    <StyledLink to={`/profile/${profileSrc.nickname}/${profileSrc.userId}`}>
                                        <ListItem
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Meu Perfil
                                        </ListItem>
                                    </StyledLink>
                                    <StyledLink to="/partnerStore">
                                        <ListItem
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Loja Parceira
                                        </ListItem>
                                    </StyledLink>
                                    {isAdmin() && (
                                        <StyledLinkForAdmin 
                                            sx={{ color: "white" }} 
                                            onClick={handleCloseAvatar} 
                                            to="/acceptContent"
                                        >
                                            <MenuItem
                                                sx={{
                                                    fontSize: {
                                                        xs: "0.875rem",
                                                        sm: "1rem"
                                                    }
                                                }}
                                            >
                                                Pedidos (Admin)
                                            </MenuItem>
                                        </StyledLinkForAdmin>
                                    )}
                                    <StyledLink to="/" onClick={() => { handleCloseAvatar(); logout(); }}>
                                        <ListItem
                                            sx={{
                                                fontSize: {
                                                    xs: "0.875rem",
                                                    sm: "1rem"
                                                }
                                            }}
                                        >
                                            Sair
                                        </ListItem>
                                    </StyledLink>
                                </List>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    // Layout para telas maiores
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "black",
                            zIndex: 2,
                            position: "fixed",
                            width: "100%",
                            height: "70px",
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            onClick={() => navigate('/welcome')}
                            src={Logo}
                            sx={{ 
                                cursor: "pointer",
                                height: "50%"
                            }}
                        />
                        <Box 
                            sx={{
                                display: "flex",
                                width: "80%",
                                pr: 2,
                                pl: 2
                            }}
                        >
                            <Grid container>
                                <Grid 
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                    item 
                                    xs={1}
                                >
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <StyledLink sx={{ color: "black" }} onClick={handleClose} to="/videos">
                                            <MenuItem>Vídeos</MenuItem>
                                        </StyledLink>
                                        <StyledLink sx={{ color: "black" }} onClick={handleClose} to="/photos">
                                            <MenuItem>Fotos</MenuItem>
                                        </StyledLink>
                                    </Menu>
                                    <a
                                        onClick={handleClick}
                                        onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = "red"}
                                        onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = "white"}
                                        style={{ 
                                            textDecoration: "none", 
                                            color: "white", 
                                            transition: "color 0.3s ease", 
                                            cursor: "pointer",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        Álbuns
                                    </a>
                                </Grid>
                                <Grid 
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                    item 
                                    xs={1}
                                >
                                    <StyledLink to="/podcasts">Podcasts</StyledLink>
                                </Grid>
                                <Grid 
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                    item 
                                    xs={1}
                                >
                                    <StyledLink to="/partnerStore">Loja Parceira</StyledLink>
                                </Grid>
                                <Grid 
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                    item 
                                    xs={1}
                                >
                                    <StyledLink to="/aboutMe">Sobre mim</StyledLink>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box 
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "20%"
                            }}
                        >
                            <Box sx={{ mr: 1 }} width="100%">
                                <UserSearchBar />
                            </Box>
                            <Box sx={{ cursor: "pointer", mr: 1 }}>
                                <Badge 
                                    onClick={handleClickPop} 
                                    badgeContent={notifications.totalCount} 
                                    sx={{ color: "yellow" }}
                                >
                                    {openPop ? <DraftsIcon color="primary" /> : <MailIcon color="primary" />}
                                </Badge>
                            </Box>
                        </Box>
                        <PopoverNotifications 
                            open={openPop}
                            anchorEl={anchorElPop}
                            onClose={handleClosePop}
                            notificationList={notifications.notifications}
                            updateNotifications={getNotifications}
                            onOpenInviteModal={handleOpenAcceptModal}
                            getNotification={handleGetNotification} 
                        />

                        <ViewInviteModal 
                            open={openIntegrantsAccept} 
                            onClose={handleCloseAcceptModal} 
                            notification={selectedInviteInfos} 
                        />

                        <Box 
                            sx={{
                                pr: 2,
                                pl: 2,
                                cursor: "pointer"
                            }}
                        >
                            {rederizeAvatar()}
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorElAvatar}
                                open={openAvatar}
                                onClose={handleCloseAvatar}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/myAccount">
                                    <MenuItem>Minha Conta</MenuItem>
                                </StyledLink>
                                <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to={`/profile/${profileSrc.nickname}/${profileSrc.userId}`}>
                                    <MenuItem>Meu Perfil</MenuItem>
                                </StyledLink>
                                <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/myVideos">
                                    <MenuItem>Meus Vídeos</MenuItem>
                                </StyledLink>
                                <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/myPhotos">
                                    <MenuItem>Minhas Fotos</MenuItem>
                                </StyledLink>
                                {isBand() && (
                                    <StyledMenu onClick={() => { handleCloseAvatar(); handleClickOpen(); }}>
                                        Integrantes
                                    </StyledMenu>
                                )}
                                <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/issueReport">
                                    <MenuItem>Reportar Problema</MenuItem>
                                </StyledLink>
                                {isAdmin() && (
                                    <StyledLinkForAdmin sx={{ color: "pink" }} onClick={handleCloseAvatar} to="/acceptContent">
                                        <MenuItem>Pedidos (Admin)</MenuItem>
                                    </StyledLinkForAdmin>
                                )}
                                <StyledMenu onClick={() => { handleCloseAvatar(); logout(); }}>
                                    Sair
                                </StyledMenu>
                            </Menu>
                        </Box>
                    </Box>
                )}
                <Box 
                    sx={{
                        height: {
                            xs: "60px",
                            sm: "70px"
                        }
                    }} 
                />
            </>
        }
        </>
    )
}

export default Navbar
