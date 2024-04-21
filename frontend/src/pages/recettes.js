import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import getToken from '../utils/getToken';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Panorama from '@mui/icons-material/Panorama'
import { convertirFormatDate } from '../utils/convertirFormatDate';
import { styled } from '@mui/material/styles';
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

export default function Recette() {
  const [recettes, setRecettes] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    duree: 0,
    description: '',
    categorie: '',
    image: '',
  });
  const token = getToken();

  const [categorie, setCategorie] = useState('');

  const handleChange = (event) => {
    setCategorie(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        'http://localhost:8081/recettes/ajouter',
        {
          nom: formData.nom,
          duree: formData.duree,
          description: formData.description,
          categorie: formData.categorie,
          image: formData.image,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'access-token': token,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          console.log('Recette ajoutée avec succès', response.data);
          setRecettes((prevRecettes) => [...prevRecettes, response.data]);
          handlePopupClose();
          notifySuccess('Recette ajoutée avec succès');
        }

        else {
          console.log('Recette pas ajouté correctement', response.data);
          handlePopupClose();
          notifyWarning('La recette n\'a pas été ajouté correctement');
        }

      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de la recette', error);
        notifyError('La recette n\'a pas pu être ajoutée');
      });
  };


  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:8081/recettes', {
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

  const handlePopupOpen = () => {
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  return (
    <ProtectedRoute allowedRoles={["1", "2"]}>
      <main>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {token && Array.isArray(recettes) && recettes.map((recette) => (
              <Grid item key={recette.id} xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar alt={recette.user_psuedo} src={recette.user_picture} />
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={recette.nom}
                    subheader={`Le ${convertirFormatDate(recette.creation)}`}
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image={recette.image}
                    alt={recette.nom}
                  />
                  <CardActions>
                    <Button color="secondary" size="medium">{recette.categorie_label}</Button>
                    <Chip icon={<AccessAlarm />} label={`${recette.duree} minutes`} color="success" sx={{ fontSize: 'initial' }} />
                  </CardActions>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {recette.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="medium">Suivre la recette</Button>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
            startIcon={<AddIcon />}
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
      </main>
    </ProtectedRoute>
  );
}
