import React from 'react';
import { Outlet } from 'react-router-dom';
import { ApplicationBar } from '../components/ApplicationBar';
import { MenuBar } from '../components/MenuBar';

export default function DashboardLayout() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    
    return (
        <React.Fragment>
            <ApplicationBar toggleDrawer={toggleDrawer} open={open} />
            <MenuBar toggleDrawer={toggleDrawer} open={open} />
            <Outlet/>
        </React.Fragment>

    )
}