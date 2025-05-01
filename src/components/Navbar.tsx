import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Payment Processing System
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Checkout
        </Button>
        <Button color="inherit" component={RouterLink} to="/history">
          Order History
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 