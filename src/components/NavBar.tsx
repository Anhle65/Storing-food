import {AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {useGetAuth} from "../hooks/useGetAuth";
import {signOut} from "firebase/auth";
import {auth} from "../config/firebase";
import {useNavigate} from "react-router-dom";
export const NavBar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const {name, photoURL} = useGetAuth();
    const navigate = useNavigate();
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const signUserOut = async () => {
        try {
            await signOut(auth)
            localStorage.clear();
            navigate('/');
        } catch (e) {
            console.error("Error signing out: ", e);
        }
    }
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    LOGO
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="user-name" src={photoURL} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <Typography padding='0 0 0 10px' variant='h6'>{name}</Typography>
                        <MenuItem key='log-out' onClick={signUserOut}>
                            <Typography sx={{ textAlign: 'center' }}>Log out</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Container>
        </AppBar>
    )
}