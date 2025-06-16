// src/components/ui/GlobalSnackbar.tsx
import { Snackbar, Alert } from '@mui/material';
import { useNotificationStore } from '../../store/notificationStore';

export const GlobalSnackbar = () => {
  const { isOpen, message, severity, hideNotification } = useNotificationStore();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};