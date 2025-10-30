import {AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Stack, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {signOut} from "firebase/auth";
import {auth} from "../config/firebase";
import {useNavigate} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';

type IUserInfo = {
    name: string;
    photoURL: string;
}
export const NavBar = ({name, photoURL}: IUserInfo) => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
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
    const goToDashboard = () => {
        navigate('/items');
    }
    return (
        <AppBar position="static">
            <Container maxWidth={false}>
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleOpenMenu}
                    >
                        <MenuIcon  sx={{color: 'white', display: 'block'}}/>
                    </IconButton>
                    <Menu sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorMenu}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        open={Boolean(anchorMenu)}
                        onClose={handleCloseMenu}>
                        <MenuItem key='dash-board' onClick={goToDashboard}>
                            <Typography sx={{ textAlign: 'center' }}>Dash board</Typography>
                        </MenuItem>
                    </Menu>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ mr: 3 }}>
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
                    </Stack>
                </Box>
            </Container>
        </AppBar>
    )
}