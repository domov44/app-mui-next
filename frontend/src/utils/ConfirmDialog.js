import React from 'react';
import { createPortal } from 'react-dom';
import { Dialog,DialogTitle,DialogContent,DialogContentText,Button, DialogActions } from '@mui/material';
import { Delete } from '@mui/icons-material';

function ConfirmDialog({
  variant,
  open,
  title,
  content,
  confirmLabel,
  onConfirm,
  onCancel,
}) {
  // Vérifiez si le code est exécuté côté client
  if (typeof document === 'undefined') {
    return null;
  }

  const appContainer = document.getElementById('__next');

  if (!appContainer) {
    return null;
  }

  return createPortal(
    <Dialog open={open} onClose={onCancel} variant={variant}>
      <form onSubmit={onConfirm} method="dialog">
        <DialogTitle sx={{fontSize:'1.5em'}}>{title || "Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content || "Voulez-vous vraiment effectuer cette action ?"}</DialogContentText>
          <DialogActions>
          <Button variant="text" onClick={onCancel} size="large">Pas maintenant</Button>
          <Button disableElevation type='submit' variant="contained" size="large" color="error" startIcon={<Delete />}>{confirmLabel || 'Oui, je confirme'}</Button>
        </DialogActions>
        </DialogContent>
      </form>
    </Dialog>,
    appContainer
  );
}

export default ConfirmDialog;
