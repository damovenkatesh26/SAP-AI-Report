import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Toolbar,
  AppBar,
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SapReport from './SapReport';
import Dashboard from './Dashboard';

function Home() {
  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left side: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/sap_logo.png" alt="SAP Logo" style={{ height: 40 }} />
          </Box>

          {/* Right side: Tabs + Account Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="Main Tabs"
              textColor="primary"
              indicatorColor="primary"
              sx={{ mr: 2 }}
            >
              <Tab label="Dashboard" sx={{ fontWeight: 'bold' }} />
              <Tab label="SAP Report" sx={{ fontWeight: 'bold' }} />
            </Tabs>

            <IconButton onClick={handleProfileClick} size="large" color="inherit">
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Tab Content */}
      <Box sx={{ p: 2 }}>
        {tabIndex === 0 && <Dashboard />}
        {tabIndex === 1 && <SapReport />}
      </Box>
    </Box>
  );
}

export default Home;
