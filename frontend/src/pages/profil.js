// pages/profile.js
import React, { useContext, useEffect, useState } from 'react';
import { Menu, Select, Modal, Stack, CardMedia, TextField, InputLabel, MenuItem, FormControl, CardActions, CardHeader, IconButton, Avatar, Chip, Button, Box, Card, CardContent, Grid, Typography, Divider, Paper, Tabs, Tab, Container } from '@mui/material';
import { UserContext } from '../utils/UserContext';
import { Mail, Room, MoreVert, Favorite, Share, AccessAlarm, Add, Panorama, Delete, Edit, Cake, MilitaryTech } from '@mui/icons-material';
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
    const { userData } = useContext(UserContext);



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
            </Container>
        </ProtectedRoute>
    );
}
