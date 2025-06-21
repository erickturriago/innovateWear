// src/components/ui/ConfirmationDialog.tsx
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({ open, options, onConfirm, onCancel }: ConfirmationDialogProps) => {
  const { title, message, confirmText = "Aceptar", cancelText = "Cancelar" } = options;

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">{cancelText}</Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};