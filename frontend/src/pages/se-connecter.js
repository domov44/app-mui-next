import React, { useState, useRef, useContext } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
  Paper,
  IconButton, // Importez IconButton
  InputAdornment, // Importez InputAdornment
} from '@mui/material';
import { UserContext } from '../utils/UserContext';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Importez l'icône pour afficher le mot de passe
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // Importez l'icône pour masquer le mot de passe
import axios from 'axios';
import Router from 'next/router';
import CustomButton from '../components/CustomButton';
import {
  showToast,
  ToastContainer,
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
  notifyDefault,
} from '../components/ui/Toastify';

function LoginForm() {
  const { handleUpdateUserData } = useContext(UserContext);

  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nouvel état pour gérer l'affichage du mot de passe
  const [globalError, setGlobalError] = useState('');

  const form = useRef(null);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setGlobalError('');
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some((error) => error !== '');

    if (!hasErrors) {
      try {
        const response = await axios.post('http://localhost:8081/user', values);
        if (response.data.Login) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1);
          const cookieString = `token=${response.data.token}; expires=${expirationDate.toUTCString()}; path=/`;
          document.cookie = cookieString;
          handleUpdateUserData();
          Router.push('/recettes');
          notifySuccess('Connexion établie avec succès');
        } else {
          setErrors({ ...errors, password: 'Email ou mot de passe incorrect' });
        }
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        if (error.response && error.response.status === 429) {
          setGlobalError('Trop de tentatives. Veuillez réessayer plus tard.');
        } else {
          setGlobalError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
        }
      }
    }
  };

  const validateForm = (formValues) => {
    const errors = {};
    if (!formValues.email) {
      errors.email = 'Ce champ est requis';
    }
    if (!formValues.password) {
      errors.password = 'Ce champ est requis';
    }
    return errors;
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Connexion
        </Typography>
        <form ref={form} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            id="email"
            label="Email"
            name="email"
            autoComplete="new-email"
            value={values.email}
            onChange={handleInput}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            id="password"
            label="Mot de passe"
            name="password"
            type={showPassword ? 'text' : 'password'} // Utilisez le type conditionnel en fonction de l'état showPassword
            autoComplete="new-password"
            value={values.password}
            onChange={handleInput}
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox checked={rememberMe} onChange={handleRememberMeChange} name="rememberMe" color="primary" />
            }
            label="Se souvenir de moi"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" size='large' sx={{ mt: 3, mb: 1 }}>
            Se connecter
          </Button>
          <CustomButton fullWidth variant="text" to="/creer-un-compte" size='large'>
            Créer mon compte
          </CustomButton>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;

