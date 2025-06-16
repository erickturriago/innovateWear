// src/store/notificationStore.ts
import { create } from 'zustand';
import { type AlertColor } from '@mui/material/Alert';

interface NotificationState {
  isOpen: boolean;
  message: string;
  severity: AlertColor;
  showNotification: (message: string, severity?: AlertColor) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  message: '',
  severity: 'info', // Valor por defecto: 'success' | 'error' | 'warning' | 'info'
  
  showNotification: (message, severity = 'info') => {
    set({ isOpen: true, message, severity });
  },
  
  hideNotification: () => {
    set({ isOpen: false });
  },
}));