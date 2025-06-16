// src/pages/AdminDashboardPage.tsx
import { useState } from 'react';
import { Box, Typography, Tab, Tabs } from '@mui/material';
import { UserManagement } from '../components/admin/UserManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { CustomDesignManagement } from '../components/admin/CustomDesignManagement';
import { ProductManagement } from '../components/admin/ProductManagement';
import { DesignManagement } from '../components/admin/DesignManagement';
// --- 1. Importar el último componente ---
import { CategoryManagement } from '../components/admin/CategoryManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: { xs: 1, sm: 2, md: 3} }}>{children}</Box>}
    </div>
  );
}

const AdminDashboardPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        Panel de Administración
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)} 
          variant="scrollable" 
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Usuarios" />
          <Tab label="Pedidos" />
          <Tab label="Camisetas Diseñadas" />
          <Tab label="Camisetas Base" />
          <Tab label="Estampas" />
          <Tab label="Categorías" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <UserManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <OrderManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <CustomDesignManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <ProductManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={4}>
        <DesignManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={5}>
        {/* --- 2. Añadir el componente a su pestaña --- */}
        <CategoryManagement />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboardPage;