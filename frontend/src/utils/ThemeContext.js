// ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export const ThemeContextProvider = ({ children, initialTheme }) => {
  const [themeMode, setThemeMode] = useState(initialTheme);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const darkPalette = {
      primary: {
        light: '#757ce8',
        main: '#D6597A',
        dark: '#ae2449',
        contrastText: '#060312',
      },
      secondary: {
        light: '#ff7961',
        main: '#FEAE8A',
        dark: '#ba000d',
        contrastText: '#000',
      },
      success: {
        main: '#1f352d',
        contrastText: '#1dffac',
      },
      warning: {
        main: '#ff9800',
        contrastText: '#fff',
      },
      error: {
        main: '#c34f46',
        contrastText: '#fff',
      },
      background: {
        default: '#060312',
        paper: '#111021',
      },
      text: {
        main: '#BCA5A7',
        primary: '#BCA5A7',
        secondary: '#AB839A',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    }

  const lightPalette = {
    primary: {
      light: '#757ce8',
      main: '#D6597A',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#FEAE8A',
      dark: '#ba000d',
      contrastText: '#000',
    },
    success: {
      main: '#1dffac',
      contrastText: '#000000',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#fff',
    },
    error: {
        main: '#D6597A',
        contrastText: '#fff',
    },
    background: {
      light: '#a366ff',
      main: '#a366ff',
      dark: '#002884',
      contrastText: '#fff',
      default: '#fff',
      paper: '#fff',
    },
    text: {
      main: '#000000',
      primary: '#000000',
      secondary: '#000000',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  }


  const baseTheme = createTheme({
    palette: {
      mode: themeMode,
      ... (themeMode === 'light' ? lightPalette : darkPalette),
    },
  });

  useEffect(() => {
    // Enregistrer le thème actuel dans le localStorage
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={baseTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
