import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import {Link} from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to={"/dashboard"}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to={'/crsummary'}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="CR Summary" />
    </ListItemButton>
    <ListItemButton component={Link} to={'/ageingsummary'}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Ageing Summary" />
    </ListItemButton>
    <ListItemButton component={Link} to={'/holidays'}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Holidays" />
    </ListItemButton>
    <ListItemButton component={Link} to={'/shiftcoverage'}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Shift Coverage" />
    </ListItemButton>
   
    
  </React.Fragment>
);

