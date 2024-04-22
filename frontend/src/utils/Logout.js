import React, { useContext } from 'react';
import axios from 'axios';
import ListItemButton from '@mui/material/ListItemButton';
import { notifySuccess, notifyError } from '../components/ui/Toastify';
import { UserContext } from './UserContext';
import Router from 'next/router';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

const Logout = () => {
    const { handleLogout } = useContext(UserContext);

    const handleLogoutRequest = () => {
        axios.get('http://localhost:8081/user/logout', { withCredentials: true })
            .then(res => {
                if (res.data.Status === "Success") {
                    notifySuccess("Déconnexion réussie");
                    handleLogout();
                    Router.push('/se-connecter');
                }
            })
            .catch(err => console.log(err))
    };

    return (
        <ListItem disablePadding sx={{ color: "var(--error-color)" }}>
        <ListItemButton onClick={handleLogoutRequest}>
            <ListItemIcon sx={{ color: "var(--error-color)" }}>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Se déconnecter" />
        </ListItemButton>
        </ListItem>
    );
};

export default Logout;
