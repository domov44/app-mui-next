import React, { useContext } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { notifySuccess, notifyError } from '../components/ui/Toastify';
import { UserContext } from './UserContext';
import Router from 'next/router';

const Logout = () => {
    const { handleLogout } = useContext(UserContext); // Utiliser la fonction de déconnexion du contexte

    const handleLogoutRequest = async () => {
        try {
            // Effectuer une requête vers le serveur pour signaler la déconnexion
            await axios.get('http://localhost:8081/logout');

            // Effacer le cookie côté client
            const expirationDate = new Date(0);
            const cookieString = `token=; expires=${expirationDate.toUTCString()}; path=/`;
            document.cookie = cookieString;

            // Effectuer les actions nécessaires côté client
            notifySuccess("Déconnexion réussie");
            handleLogout();
            Router.push('/');
        } catch (err) {
            console.error(err);
            notifyError("Une erreur s'est produite lors de la déconnexion.");
        }
    };
    
    return (
        <Button onClick={handleLogoutRequest} color="error">Se déconnecter</Button>
    );
};

export default Logout;
