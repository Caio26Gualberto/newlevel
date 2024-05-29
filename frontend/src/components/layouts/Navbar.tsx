import { Avatar, Box, Grid, Menu, MenuItem, styled } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "../../assets/128982_logo.png"
import React from "react";
import { useAuth } from "../../AuthContext";
import { AuthenticateApi, UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import * as toastr from 'toastr';
import { profile } from "console";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;

  &:hover {
    color: red;
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
    const navigate = useNavigate();
    const location = useLocation()
    const { isAdmin } = useAuth()
    const [showNavbar, setShowNavbar] = useState<boolean>(false)
    const [profileSrc, setProfileSrc] = useState({
        profilePicture: "",
        nickname: ""
    })

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorElAvatar, setAnchorElAvatar] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openAvatar = Boolean(anchorElAvatar);

    const notAllowedPaths = [
        "/",
        "/welcome",
        "/register",
        "/security/resetPassword"
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
            return <Avatar component="a" sx={{ width: 50, height: 50 }} src={profileSrc.profilePicture} onClick={handleClickAvatar}></Avatar>
        } else {
            return <Avatar component="a" onClick={handleClickAvatar} sx={{ width: 50, height: 50, backgroundColor: randomColor }}>{(profileSrc as { nickname: string }).nickname.charAt(0)}</Avatar>
        }
    }

    const getAvatarToNavbar = async () => {
        const result = await userService.apiUserGetUserInfoGet()
        if (result.isSuccess) {
            setProfileSrc({ profilePicture: result.data!.profilePicture!, nickname: result.data!.nickname! })
        } else {
            toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
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
        }
    }
        , [location])

    return (
        <>{showNavbar &&
            <>
                <Box display="flex" justifyContent="space-evenly" alignItems="center" bgcolor="black" zIndex={2} position="fixed" width="100%" height="70px">
                    <Box component="img" onClick={async () => {
                        navigate('/welcome')
                    }} src={Logo} height="50%" pl={2} sx={{ cursor: "pointer" }}>
                    </Box>
                    <Box display="flex" width="95%" pr={2} pl={2}>
                        <Grid container>
                            <Grid display="flex" justifyContent="center" item xs={1}>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <StyledLink sx={{ color: "black" }} onClick={handleClose} to="/videos"><MenuItem>Vídeos</MenuItem></StyledLink>
                                    <StyledLink sx={{ color: "black" }} onClick={handleClose} to="/photos"><MenuItem>Fotos</MenuItem></StyledLink>
                                </Menu>
                                <a onClick={handleClick} onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = "red"}
                                    onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = "white"}
                                    style={{ textDecoration: "none", color: "white", transition: "color 0.3s ease", cursor: "pointer" }}>Álbuns</a>
                            </Grid>
                            <Grid display="flex" justifyContent="center" item xs={1}>
                                <StyledLink to="/podcasts">Podcasts</StyledLink>
                            </Grid>
                            <Grid display="flex" justifyContent="center" item xs={1}>
                                <StyledLink to="/aboutMe">Sobre mim</StyledLink>
                            </Grid>
                            <Grid display="flex" justifyContent="center" item xs={1}>

                            </Grid>
                        </Grid>
                    </Box>
                    <Box pr={2} pl={2} sx={{ cursor: "pointer" }}>
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
                            <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/myProfile"><MenuItem>Meu Perfil</MenuItem></StyledLink>
                            <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/myVideos"><MenuItem>Meus Vídeos</MenuItem></StyledLink>
                            <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/myPhotos"><MenuItem>Minhas Fotos</MenuItem></StyledLink>
                            {isAdmin() && <StyledLink sx={{ color: "black" }} onClick={handleCloseAvatar} to="/acceptContent"><MenuItem>Pedidos</MenuItem></StyledLink>}
                            <StyledMenu onClick={() => { handleCloseAvatar(); logout(); }}>Sair</StyledMenu>
                        </Menu>
                    </Box>
                </Box>
                <Box height="70px" />
            </>
        }
        </>
    )
}

export default Navbar
