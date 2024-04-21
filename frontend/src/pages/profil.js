// pages/profile.js
import React, { useContext, useEffect, useState } from 'react';
import { Menu, Select, Modal, Stack, CardMedia, TextField, InputLabel, MenuItem, FormControl, CardActions, CardHeader, IconButton, Avatar, Chip, Button, Box, Card, CardContent, Grid, Typography, Divider, Paper, Tabs, Tab, Container } from '@mui/material';
import { UserContext } from '../utils/UserContext';
import { Mail, Room, MoreVert, Favorite, Share, AccessAlarm, Add, Panorama, Delete, Edit, Cake, MilitaryTech } from '@mui/icons-material';
import getToken from '../utils/getToken';
import axios from 'axios';
import { confirm } from '../utils/ConfirmGlobal';
import { styled } from '@mui/material/styles';
import { convertirFormatDate } from '../utils/convertirFormatDate';
import ProtectedRoute from '../utils/ProtectedRoute';
import {
    showToast,
    ToastContainer,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
    notifyDefault,
} from '../components/ui/Toastify';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function Profile() {
    const [selectedRecette, setSelectedRecette] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [recettes, setRecettes] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const { userData } = useContext(UserContext);
    const [formData, setFormData] = useState({
        nom: '',
        duree: 0,
        description: '',
        categorie: '',
        image: '',
    });
    const token = getToken(); // Assurez-vous de fournir la fonction getToken appropriée

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (token) {
            axios
                .get('http://localhost:8081/user/recettes', {
                    headers: {
                        'access-token': token,
                    },
                })
                .then((response) => {
                    const sortedRecettes = response.data.sort((a, b) => new Date(b.creation) - new Date(a.creation));
                    setRecettes(sortedRecettes);
                })
                .catch((error) =>
                    console.error('Erreur lors du chargement des recettes', error)
                );
            console.log('Affichage des recettes');
        } else {
            console.log('Echec');
        }
    }, [token]);

    const [categorie, setCategorie] = useState('');

    const handleChange = (event) => {
        setCategorie(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('nom', formData.nom);
        formDataToSend.append('duree', formData.duree);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('categorie', formData.categorie);
        formDataToSend.append('image', formData.image);

        axios
            .post('http://localhost:8081/recettes/ajouter', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'access-token': token,
                },
            })
            .then((response) => {
                if (response.data) {
                    console.log('Recette ajoutée avec succès', response.data);
                    setRecettes((prevRecettes) => [...prevRecettes, response.data]);
                    handlePopupClose();
                    notifySuccess('Recette ajoutée avec succès');
                } else {
                    console.log('Recette pas ajoutée correctement', response.data);
                    handlePopupClose();
                    notifyWarning("La recette n'a pas été ajoutée correctement");
                }
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout de la recette", error);
                notifyError("La recette n'a pas pu être ajoutée");
            });
    };

    const handlePopupOpen = () => {
        setOpenPopup(true);
    };

    const handlePopupClose = () => {
        setOpenPopup(false);
    };

    const handleOpenMenu = (event, recette) => {
        setAnchorEl(event.currentTarget);
        setSelectedRecette(recette);
    };


    const handleDeleteRecette = async (id) => {
        if (await confirm({ title: "Voulez-vous vraiment supprimer cette recette ?", content: "Cette recette sera supprimée definitevement et personne ne pourra y accéder", variant: "danger" }))
            try {
                await axios.delete(`http://localhost:8081/recettes/delete/${id}`, {
                    headers: {
                        'access-token': token,
                    },
                });

                setRecettes((prevRecettes) => prevRecettes.filter((recette) => recette.id !== id));
                setAnchorEl(null);
                notifySuccess('Recette supprimée avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression de la recette', error);
                notifyError('La recette n\'a pas pu être supprimée');
            }
    };
    return (
        <ProtectedRoute allowedRoles={["1", "2"]}>
            <Container maxWidth="lg" style={{ minHeight: '100vh', padding: '20px' }}>
                <Typography variant="h1" sx={{
                    marginBottom: '10px',
                    marginTop: '30px',
                    fontWeight: '700',
                    fontSize: '1.5rem',
                }}>
                    Votre Profil
                </Typography>
                <Divider style={{ width: '100%', marginBottom: '30px' }} />
                <Box
                    sx={{
                        height: '290px',
                        color: 'rgb(255, 255, 255)',
                        background:
                            'linear-gradient(rgba(0, 75, 80, 0.8), rgba(0, 75, 80, 0.8)) center center / cover no-repeat, url(https://i.pinimg.com/originals/e3/8f/51/e38f5119897d3a4f81ed85bb860acc85.jpg)',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        marginBottom: '30px',
                        position: 'relative',
                        boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
                        borderRadius: '16px',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{
                        left: '24px',
                        bottom: '24px',
                        zIndex: '10',
                        paddingTop: '0px',
                        position: 'absolute',
                    }}>
                        <Avatar alt="User Avatar" src={userData.picture} sx={{ width: 120, height: 120 }} />
                        <Typography variant="span" sx={{
                            margin: '0px',
                            fontWeight: '700',
                            lineHeight: '1.5',
                            fontSize: '1.5rem',
                        }}>
                            {userData.name} {userData.surname}
                        </Typography>
                    </Stack>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={5}>
                        <Paper sx={{
                            padding: '24px',
                            borderRadius: '15px',
                        }}>
                            <Stack direction="column" spacing={2} sx={{

                            }}>
                                <Typography variant="h4" sx={{
                                    marginBottom: '10px',
                                    marginTop: '30px',
                                    fontWeight: '700',
                                    fontSize: '1.5rem',
                                }}>
                                    Profil
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {userData.description}
                                </Typography>
                                <Button color="secondary" size="medium">Modifiez votre description</Button>
                                <Divider style={{ width: '100%', margin: '10px 0' }} />
                                <Chip icon={<Mail />} label={`${userData.email}`} color="success" sx={{ fontSize: 'initial', width: 'fit-content' }} />
                                <Chip icon={<Room />} label={`Vis à ${userData.ville}`} color="success" sx={{ fontSize: 'initial', width: 'fit-content' }} />
                                <Chip icon={<Cake />} label={`${userData.age} ans`} color="success" sx={{ fontSize: 'initial', width: 'fit-content' }} />
                                <Chip icon={<MilitaryTech />} label={`Membre depuis ${userData.daysSinceCreation} jours`} color="success" sx={{ fontSize: 'initial', width: 'fit-content' }} />
                                <Button color="secondary" size="medium">Modifiez vos informations</Button>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item xs={8} sm={7}>
                        <Stack direction="column" spacing={2} sx={{

                        }}>
                            {token && Array.isArray(recettes) && recettes.map((recette, i) => (
                                <Card key={recette.id} sx={{ borderRadius: '15px' }}>
                                    <CardHeader
                                        avatar={
                                            <Avatar alt={recette.user_pseudo} src={recette.user_picture} />
                                        }
                                        action={
                                            <>
                                                <IconButton aria-label="settings" onClick={(event) => handleOpenMenu(event, recette)}>
                                                    <MoreVert />
                                                </IconButton>

                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={() => setAnchorEl(null)}
                                                >
                                                    <Stack spacing={1} direction='column' padding={1}>
                                                        <Button
                                                            sx={{ justifyContent: 'start' }}
                                                            color='text'
                                                            startIcon={<Edit />}
                                                        >
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            sx={{ justifyContent: 'start' }}
                                                            onClick={() => handleDeleteRecette(selectedRecette.id)}
                                                            color={'error'}
                                                            startIcon={<Delete />}
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </Stack>
                                                </Menu>


                                            </>
                                        }
                                        title={recette.nom}
                                        subheader={`Le ${convertirFormatDate(recette.creation)}`}
                                    />

                                    <Box
                                        sx={{
                                            padding: 2,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            sx={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: '300px',
                                                borderRadius: '5px',

                                            }}
                                            src={recette.image}
                                            alt={recette.nom}
                                        />
                                    </Box>
                                    <CardActions>
                                        <Button color="secondary" size="medium">{recette.categorie_label}</Button>
                                        <Chip icon={<AccessAlarm />} label={`${recette.duree} minutes`} color="success" sx={{ fontSize: 'initial' }} />
                                    </CardActions>
                                    <CardContent>
                                        <Typography variant="body2">
                                            {recette.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="medium">Voir ma recette</Button>
                                        <IconButton aria-label="add to favorites">
                                            <Favorite />
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <Share />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handlePopupOpen}
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        '& .MuiButton-startIcon': {
                            marginRight: 1,
                        },
                    }}
                    startIcon={<Add />}
                >
                    Ajouter une recette
                </Button>
                <Modal open={openPopup} onClose={handlePopupClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" component="div" gutterBottom>
                            Ajouter une recette
                        </Typography>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <TextField
                                fullWidth
                                label="Nom de la recette"
                                variant="outlined"
                                margin="normal"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            />
                            <TextField
                                type="number"
                                fullWidth
                                label="Durée de préparation"
                                variant="outlined"
                                margin="normal"
                                value={formData.duree}
                                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.categorie}
                                    label="Catégorie"
                                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                >
                                    <MenuItem value={1}>Soupe</MenuItem>
                                    <MenuItem value={2}>Dessert</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                rows={4}
                                multiline
                                fullWidth
                                label="Description"
                                variant="outlined"
                                margin="normal"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<Panorama />}
                                sx={{
                                    mt: 2,
                                }}
                            >
                                Choisir une photo
                                <VisuallyHiddenInput
                                    name="image"
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => {
                                        console.log(e.target.files[0]); // Vérifiez la valeur du fichier sélectionné
                                        setFormData({ ...formData, image: e.target.files[0] });
                                    }}
                                />
                            </Button>
                            <Button type="submit" variant="contained" color="primary"
                                sx={{
                                    mt: 2,
                                }}>
                                Confirmer ma recette
                            </Button>
                            <Button
                                variant="text"
                                onClick={handlePopupClose}
                                sx={{ marginLeft: 1, mt: 2 }}
                            >
                                Annuler
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </Container>
        </ProtectedRoute>
    );
}
