// src/context/ConfirmProvider.tsx
import { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';

const defaultOptions = {
    title: '¿Estás seguro?',
    message: 'Esta acción no se puede deshacer.',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
};

type ConfirmOptions = typeof defaultOptions;

const ConfirmContext = createContext<(options?: Partial<ConfirmOptions>) => Promise<boolean>>(() => Promise.resolve(false));

export const useConfirm = () => {
    return useContext(ConfirmContext);
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(defaultOptions);
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});

    const confirm = useCallback((newOptions?: Partial<ConfirmOptions>) => {
        return new Promise<boolean>((resolve) => {
            setOptions({ ...defaultOptions, ...newOptions });
            setOpen(true);
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleClose = () => {
        resolvePromise(false);
        setOpen(false);
    };

    const handleConfirm = () => {
        resolvePromise(true);
        setOpen(false);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <ConfirmationDialog
                open={open}
                options={options}
                onCancel={handleClose}
                onConfirm={handleConfirm}
            />
        </ConfirmContext.Provider>
    );
};