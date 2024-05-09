import { Box, Grid, Menu, MenuItem, styled } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "../../assets/128982_logo.png"
import React from "react";

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
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (location.pathname === "/" || location.pathname === "/welcome") {
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
                    }} src={Logo} height="50%" pl={2} sx={{ cursor: "pointer" }}></Box>
                    <Box display="flex" width="95%" pr={2} pl={2}>
                        <Grid container>
                            <Grid display="flex" justifyContent="center" xs={1}>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                    
                                >
                                    <MenuItem><StyledLink sx={{color: "black"}} to="/videos">Vídeos</StyledLink></MenuItem>
                                    <MenuItem><StyledLink sx={{color: "black"}} to="/photos">Fotos</StyledLink></MenuItem>
                                </Menu>
                                <a onClick={handleClick} onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = "red"}
                                    onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = "white"}
                                    style={{ textDecoration: "none", color: "white", transition: "color 0.3s ease", cursor: "pointer" }}>Álbuns</a>
                            </Grid>
                            <Grid display="flex" justifyContent="center" xs={1}>
                                <StyledLink to="/">Podcasts</StyledLink>
                            </Grid>
                            <Grid display="flex" justifyContent="center" xs={1}>
                                <StyledLink to="/">Sobre mim</StyledLink>
                            </Grid>
                            <Grid display="flex" justifyContent="center" xs={1}>
                                <StyledLink to="/">Meu perfil</StyledLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box height="70px" />
            </>
        }
        </>
    )
}

export default Navbar
