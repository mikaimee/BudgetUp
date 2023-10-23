import React, { useState } from 'react';
import { Box, CssBaseline, Container, Grid, Typography, Divider, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MuiDrawer from '@mui/material/Drawer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import List from '@mui/material/List';

import Nav from '../../components/Nav';
import ExpensePage from './ExpensePage'
import DashboardPage from './DashboardPage';
import IncomePage from './IncomePage';
import SavingsPage from './SavingsPage';
import Budget from './Budget';

const drawerWidth = 240;

const Main = () => {
    const [open, setOpen] = React.useState(true)
    const [selectedNavItem, setSelectedNavItem] = useState('Dashboard')
    const [headerTitle, setHeaderTitle] = useState('Dashboard')

    const toggleDrawer = () => {
        setOpen(!open);
    }

    const handleNavItemClick = (item) => {
        setHeaderTitle(item)
        setSelectedNavItem(item)
    }

    return (
        <ThemeProvider theme={createTheme()}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <AppBar 
                    position="absolute" 
                    open={open}
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        transition: (theme) => 
                            theme.transitions.create(['width', 'margin'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen
                            }),
                        ...(open && {
                            marginLeft: drawerWidth,
                            width: `calc(100% - ${drawerWidth}px)`,
                            transition: (theme) =>
                                theme.transitions.create(['width', 'margin'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen
                                })
                        })
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <ViewHeadlineIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            {headerTitle}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Divider />
                <MuiDrawer
                    variant='permanent'
                    open={open}
                    sx={(theme) => ({
                        '& .MuiDrawer-paper': {
                            position: 'relative',
                            whiteSpace: 'nowrap',
                            width: drawerWidth,
                            ...(open
                                ? {
                                    transition: theme.transitions.create('width', {
                                        easing: theme.transitions.easing.sharp,
                                        duration: theme.transitions.duration.enteringScreen
                                    })
                                }
                                : {
                                    transition: theme.transitions.create('width', {
                                        easing: theme.transitions.easing.sharp,
                                        duration: theme.transitions.duration.leavingScreen
                                    }),
                                    width: theme.spacing(7),
                                    [theme.breakpoints.up('sm')]: {
                                        width: theme.spacing(9)
                                    }
                                }
                            )
                        }
                    })}
                >
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1]
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List>
                        <Nav handleNavItemClick={handleNavItemClick} />
                    </List>
                </MuiDrawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 4 }}>
                        {selectedNavItem === 'Dashboard' && (
                            <Grid container spacing={3}>
                                <DashboardPage />
                            </Grid>
                        )}
                        {selectedNavItem === 'Income' && (
                            <Grid container spacing={3}>
                                <IncomePage />
                            </Grid>
                        )}
                        {selectedNavItem === 'Expense' && (
                            <Grid container spacing={3}>
                                <ExpensePage />
                            </Grid>
                        )}
                        {selectedNavItem === 'Savings' && (
                            <Grid container spacing={3}>
                                <SavingsPage />
                            </Grid>
                        )}
                        {selectedNavItem === 'Budget' && (
                            <Grid container spacing={3}>
                                <Budget />
                            </Grid>
                        )}
                        {/* <Grid container spacing={3}>
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <Typography variant="h6" component="div">
                                        Static Text 1
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Some description for Text 1.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <Typography variant="h6" component="div">
                                        Static Text 2
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Some description for Text 2.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" component="div">
                                        Static Text 3
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Some description for Text 3.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid> */}
                    </Container>
                </Box>
            </Box>
    </ThemeProvider>
    )
}

export default Main