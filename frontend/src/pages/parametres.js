import React, { useContext, useEffect, useState } from 'react';
import { Menu, Select, Modal, Stack, CardMedia, TextField, InputLabel, MenuItem, FormControl, CardActions, CardHeader, IconButton, Avatar, Chip, Button, Box, Card, CardContent, Grid, Typography, Divider, Paper, Tabs, Tab, Container } from '@mui/material';
import { UserContext } from '../utils/UserContext';
import { Mail, Room, MoreVert, Favorite, Share, AccessAlarm, Add, Panorama, Delete, Edit, Cake, MilitaryTech } from '@mui/icons-material';
import { convertirFormatDate } from '../utils/convertirFormatDate';
import ProtectedRoute from '../utils/ProtectedRoute';
import ThemeSwitch from '../components/ui/ThemeSwitch';
import {
    showToast,
    ToastContainer,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
    notifyDefault,
} from '../components/ui/Toastify';
import { ThemeContext } from '@emotion/react';

export default function Parametres() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    return (
        <ProtectedRoute allowedRoles={["1", "2"]}>
            <Container maxWidth="lg" style={{ minHeight: '100vh', padding: '20px' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="error"
                    textColor="error"
                >
                    <Tab icon={<Mail />} iconPosition="start" label="Général" />
                    <Tab icon={<Room />} iconPosition="start" label="Onglet 2" />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <ThemeSwitch />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    Test 2
                </TabPanel>
            </Container>
        </ProtectedRoute>
    );
}

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
            {value === index && (
                <Paper sx={{
                    padding: '24px',
                    marginTop: '30px',
                    borderRadius: '15px',
                }}>{children}
                </Paper>
            )}
        </div>
    );
}
