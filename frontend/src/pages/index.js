import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import CustomButton from '../components/CustomButton';

// Styles pour le Paper
const StyledPaper = styled(Paper)({
  padding: ({ theme }) => theme.spacing(2),
  textAlign: 'center',
  color: ({ theme }) => theme.palette.text.secondary,
});


export default function Dashboard() {
  const theme = useTheme();

  return (
    <Container component="main" maxWidth="xs">
      <Grid container justifyContent="center" alignItems="center" style={{ height: 'calc( 100vh - 69px' }}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h5">Total des utilisateurs</Typography>
            <Typography variant="h3">1000</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h5">Total des ventes</Typography>
            <Typography variant="h3">$10,000</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h5">Nouveaux utilisateurs</Typography>
            <Typography variant="h3">200</Typography>
          </StyledPaper>
        </Grid>
      </Grid>
      <CustomButton variant="contained" color="primary" to="/se-connecter">
        Se connecter
      </CustomButton>
    </Container>
  );
}