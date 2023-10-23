import React from 'react';
import { Box, CssBaseline, Container, Grid, Paper, Typography, Link, Divider, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MuiDrawer from '@mui/material/Drawer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import List from '@mui/material/List';
import SavingsIcon from '@mui/icons-material/Savings';

import Nav from '../../components/Nav';

const drawerWidth = 240;

const Main = () => {
    const [open, setOpen] = React.useState(true)

    const toggleDrawer = () => {
        setOpen(!open);
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
                            Dashboard
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
                        <Nav />
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
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
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
                        </Grid>
                    </Container>
                </Box>
            </Box>
    </ThemeProvider>
    )
}

export default Main