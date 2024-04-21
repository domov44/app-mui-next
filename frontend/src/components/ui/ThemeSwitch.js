import React, { useEffect } from 'react';
import { useThemeContext } from '../../utils/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import {
  showToast,
  ToastContainer,
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
  notifyDefault,
} from './Toastify';

const ThemeSwitch = () => {
  const { themeMode, toggleTheme, setThemeMode } = useThemeContext();

  useEffect(() => {
    // Récupérer le thème enregistré dans le localStorage lors du chargement de la page
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme && savedTheme !== themeMode) {
      setThemeMode(savedTheme);
    }
  }, [themeMode, setThemeMode]);


  const handleThemeChange = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    toggleTheme(newTheme);
    const message = themeMode === 'dark' ? 'Mode clair activé' : 'Mode sombre activé';
    notifySuccess(message);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      {themeMode === 'dark' ? 'Mode sombre' : 'Mode clair'}
      <IconButton sx={{ ml: 1 }} onClick={handleThemeChange} color="inherit">
        {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </>
  );
};

export default ThemeSwitch;
