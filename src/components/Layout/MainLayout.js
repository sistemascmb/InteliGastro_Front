import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

const drawerWidth = 280;

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      <Box
        sx={{
          width: sidebarOpen ? drawerWidth : 0,
          flexShrink: 0,
          transition: 'width 0.4s ease-in-out',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: drawerWidth,
            height: '100vh',
            transform: sidebarOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
            transition: 'transform 0.4s ease-in-out'
          }}
        >
          <Sidebar />
        </Box>
      </Box>
      
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        <Box
          sx={{
            height: '20%',
            backgroundColor: '#f8f9fa'
          }}
        />

        <Box
          sx={{
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#e8eaf0',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: '5%',
              backgroundColor: 'white',
              border: '1px solid #d0d7de',
              borderRadius: '8px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              mx: '5%',
              mt: '5%',
              mb: 2,
              zIndex: 10,
              flexShrink: 0
            }}
          >
            <IconButton
              onClick={handleSidebarToggle}
              sx={{ 
                mr: 2,
                padding: '8px',
                border: '1px solid #d0d7de',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#f6f8fa'
                }
              }}
            >
              <MenuIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: 'white',
              border: '1px solid #d0d7de',
              borderRadius: '8px',
              p: 3,
              overflow: 'auto',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              mx: '5%',
              mb: '5%'
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;