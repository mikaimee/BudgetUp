import React from 'react'
import { Box, Grid, Button, Container, Typography, Paper } from '@mui/material'
import { useNavigate } from "react-router-dom"

const Home = () => {

    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    const handleRegister = () => {
        navigate('/register')
    }

    return (
        <Container>
            <Box 
                padding="20px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h4">
                    <strong>Budget Up</strong>
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        style={{ marginLeft: '10px' }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </div>
            </Box>
            <Box py={15} textAlign="center" padding="20px" style={{backgroundColor: 'rgb(122, 170, 171)'}}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/budget.webp" alt="Budget" style={{width:'75%'}}/>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }} >
                        <Typography variant="h4">
                            Easily track your finances to reach your goals
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleRegister}>
                            Register
                        </Button>
                    </div>
                </div>
            </Box>
            <Box py={15} textAlign="center" padding="20px">
                <Typography variant="h4" align="center" paragraph>
                    Make it easier to manage your finances by:
                </Typography>
                <Grid container justifyContent="space-around">
                    <Grid item>
                        <Paper elevation={3}  style={{ padding: '10px', maxWidth: '250px', backgroundColor: 'rgb(122, 170, 171)' }}>
                            <Typography variant="h5" align="center" paragraph>
                                Tracking your financial progress and spending habits
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper elevation={3}  style={{ padding: '10px', maxWidth: '250px', backgroundColor: 'rgb(122, 170, 171)' }}>
                            <Typography variant="h5" align="center" paragraph>
                                Getting valuable insights
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper elevation={3}  style={{ padding: '10px', maxWidth: '250px', backgroundColor: 'rgb(122, 170, 171)' }}>
                            <Typography variant="h5" align="center" paragraph>
                                Personalizing and creating your own financial goals
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Home