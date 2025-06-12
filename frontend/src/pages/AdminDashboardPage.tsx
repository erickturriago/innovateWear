// src/pages/AdminDashboardPage.tsx
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, List, ListItem, ListItemButton, ListItemText, Collapse, ListItemIcon } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import LabelIcon from '@mui/icons-material/Label';

import { AdminFacade } from '../patterns/facade/AdminFacade';
import type { User } from '../models/User';
import { CategoryComponent, Category, CategoryGroup } from '../patterns/composite/CategoryComponent';

const CategoryTreeItem = ({ component }: { component: CategoryComponent }) => {
  const [open, setOpen] = useState(true);
  const isGroup = component.isComposite();

  const handleClick = () => {
    if (isGroup) setOpen(!open);
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>{isGroup ? <FolderIcon /> : <LabelIcon />}</ListItemIcon>
          <ListItemText primary={component.getName()} />
          {isGroup ? open ? <ExpandLess /> : <ExpandMore /> : null}
        </ListItemButton>
      </ListItem>
      {isGroup && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {(component as CategoryGroup).getChildren().map((child, index) => (
              <CategoryTreeItem key={index} component={child} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const { users, categories } = await AdminFacade.getDashboardData();
      setUsers(users);

      const root = new CategoryGroup(0, 'Todas las Categorías');
      // En una app real, este árbol se construiría a partir de los datos de 'categories'
      const moda = new CategoryGroup(1, 'Moda');
      moda.add(new Category(10, 'Urbano'));
      root.add(moda);
      setCategoryTree(root);
      
      setIsLoading(false);
    };
    loadData();
  }, []);
  
  const handleApprove = async (userToApprove: User) => {
    const updatedUser = await AdminFacade.approveArtist(userToApprove);
    if (updatedUser) {
      alert(`Artista ${updatedUser.name} aprobado.`);
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    } else {
      alert('Error al aprobar al artista.');
    }
  };

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>Panel de Administración</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Gestión de Usuarios</Typography>
            {isLoading ? <CircularProgress /> : (
              <List>
                {users.map(user => (
                  <ListItem key={user.id} secondaryAction={
                    user.role === 'ARTISTA' && !user.active ? (
                      <Button variant="contained" size="small" onClick={() => handleApprove(user)}>Aprobar</Button>
                    ) : null
                  }>
                    <ListItemText primary={user.name} secondary={`${user.role} - ${user.active ? 'Activo' : 'Inactivo'}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
           <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6">Gestión de Categorías</Typography>
               {isLoading || !categoryTree ? <CircularProgress /> : (
                 <List><CategoryTreeItem component={categoryTree} /></List>
               )}
           </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;