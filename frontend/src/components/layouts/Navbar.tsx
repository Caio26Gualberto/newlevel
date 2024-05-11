import { Avatar, Box, Grid, Menu, MenuItem, styled } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "../../assets/128982_logo.png"
import React from "react";
import Photo from "../../assets/Celtif_Frost.jpg"

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }
`;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const [showNavbar, setShowNavbar] = useState<boolean>(false)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorElAvatar, setAnchorElAvatar] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openAvatar = Boolean(anchorElAvatar);
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

    useEffect(() => {
        if (location.pathname === "/" || location.pathname === "/welcome" || location.pathname === "/register") {
            setShowNavbar(false)
        } else {
            setShowNavbar(true)
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
                                    <StyledLink sx={{ color: "black" }} to="/videos"><MenuItem>Vídeos</MenuItem></StyledLink>
                                    <StyledLink sx={{ color: "black" }} to="/photos"><MenuItem>Fotos</MenuItem></StyledLink>
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
                        <Avatar component="a" sx={{ width: 50, height: 50 }} src={Photo} onClick={handleClickAvatar} />
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorElAvatar}
                            open={openAvatar}
                            onClose={handleCloseAvatar}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem><StyledLink sx={{ color: "black" }} to="/myProfile">Meu perfil</StyledLink></MenuItem>
                            <MenuItem><StyledLink sx={{ color: "black" }} to="/myVideos">Meus vídeos</StyledLink></MenuItem>
                            <MenuItem><StyledLink sx={{ color: "black" }} to="/">Sair</StyledLink></MenuItem>
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
