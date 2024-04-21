import React, { useState } from 'react';
import { Button, Container, Typography, Avatar, Paper } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { TextField, Input, InputAdornment, IconButton } from '@mui/material';
import axios from 'axios';
import CustomButton from '../components/CustomButton';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../components/ui/Toastify';

const CreateModule = () => {
    const [errors, setErrors] = useState({});
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [password, setPassword] = useState('');

    const handlePageImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));

        if (password !== confirmPassword) {
            setErrors({ ...errors, password: "Les 2 mots de passe ne se correspondent pas" });
            notifyError("Le compte n'a pas pu être ajouté");
            return;
        } else if (password === '' && confirmPassword === '') {
            setErrors({ ...errors, password: "Le mot de passe ne peut pas être vide" });
            notifyError("Le compte n'a pas pu être ajouté");
            return;
        }

        const formData = new FormData();
        formData.append('pseudo', pseudo);
        formData.append('surname', surname);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role_id', '2'); // Fixé à 2 par défaut
        formData.append('image', image);

        axios
            .post('http://localhost:8081/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            })
            .then((res) => {
                console.log(res);
                notifySuccess("Inscription réussie");
                handleUpdateUserData();
                Router.push('/profil');
            })
            .catch((err) => {
                if (err.response && err.response.status === 409) {
                    const errorMessage = err.response.data;
                    notifyError("Le compte n'a pas pu être ajouté");
                    setErrors((prevErrors) => ({ ...prevErrors, email: errorMessage }));
                }
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Ajouter un compte
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Pseudo"
                        onChange={(e) => setPseudo(e.target.value)}
                        value={pseudo}
                        error={Boolean(errors.pseudo)}
                        helperText={errors.pseudo}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Prénom"
                        onChange={(e) => setSurname(e.target.value)}
                        value={surname}
                        error={Boolean(errors.surname)}
                        helperText={errors.surname}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Nom"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        autoComplete="new-password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                        }}
                        value={password}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Confirmer le mot de passe"
                        type="password"
                        autoComplete="new-password"
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                        }}
                        value={confirmPassword}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                    />
                    <Input
                        type="file"
                        id="image"
                        accept="image/png, image/jpeg"
                        onChange={handlePageImageChange}
                    />
                    <Button type="submit" fullWidth variant="contained" size='large' sx={{ mt: 3, mb: 1 }}>
                        Valider
                    </Button>
                    <CustomButton fullWidth variant="text" to="/se-connecter" size='large'>
                        J'ai déjà un compte
                    </CustomButton>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateModule;
