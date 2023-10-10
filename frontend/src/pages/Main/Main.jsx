import React from 'react';
import { Box, CssBaseline, Container, Grid, Paper, Typography, Link, Divider, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Main = () => {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    }

    const mainListItems = (
        <div>
            <Link href="#" variant="body2">
                Link 1
            </Link>
            <Link href="#" variant="body2">
                Link 2
            </Link>
            <Link href="#" variant="body2">
                Link 3
            </Link>
            </div>
        );
    
    const secondaryListItems = (
        <div>
            <Link href="#" variant="body2">
                Link 1
            </Link>
            <Link href="#" variant="body2">
                Link 2
            </Link>
        </div>
    )

    return (
        <ThemeProvider theme={createTheme()}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                        pr: '24px', // keep right padding when drawer closed
                        }}
                    >
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
                        <MenuIcon />
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
                        <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Divider />
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