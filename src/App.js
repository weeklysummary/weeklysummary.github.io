import React from 'react';
import { MenuBar } from './components/MenuBar';
import { ApplicationBar } from './components/ApplicationBar';
import {createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Router from './routes';

const mdTheme = createTheme();

function App() {
  
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Router />
      </Box>
    </ThemeProvider>
  );
}

export default App;
