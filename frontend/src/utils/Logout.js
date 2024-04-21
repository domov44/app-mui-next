import React, { useContext } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { notifySuccess, notifyError } from '../components/ui/Toastify';
import { UserContext } from './UserContext';
import Router from 'next/router';

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
        <Button onClick={handleLogoutRequest} color="error">Se déconnecter</Button>
    );
};

export default Logout;
