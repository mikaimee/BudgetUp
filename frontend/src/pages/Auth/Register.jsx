import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/authHook' 
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { TextField, Button, Grid, Box, Typography, Avatar, Link, Container, createTheme, ThemeProvider } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CssBaseline from '@mui/material/CssBaseline'


const Register = () => {

    const navigate = useNavigate()
    const { registerUser, isLoading } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [dateOfBirth, setDateOfBirth] = useState('')

    const onSubmit = async (data) => {
        const { password, confirmPassword } = data

        // if passwords are matching
        if (password !== confirmPassword) {
            toast.error('Password and Confirm Password do not match.', { autoClose: 3000 })
            return
        }

        // Convert the Date of Birth format (MM/DD/YYYY) to a single date string
        const dobParts = dateOfBirth.split('/')
        if (dobParts.length !== 3) {
            toast.error('Invalid Date of Birth format (MM/DD/YYYY).', { autoClose: 3000 })
            return
        }

        const month = parseInt(dobParts[0], 10)
        const day = parseInt(dobParts[1], 10)
        const year = parseInt(dobParts[2], 10)

        if (isNaN(month) || isNaN(day) || isNaN(year)) {
            toast.error('Invalid Date of Birth format (MM/DD/YYYY).', { autoClose: 3000 })
            return
        }

        // Check if date is correct range
        const dobDate = new Date(year, month - 1, day);
        const today = new Date();
        const minDate = new Date('1850-01-01');
    
        if (dobDate > today) {
        toast.error('Date of Birth cannot be in the future.', { autoClose: 3000 });
        return;
        }
    
        if (dobDate < minDate) {
        toast.error('Date of Birth cannot be earlier than 01/01/1850.', { autoClose: 3000 });
        return;
        }

        try {
            const response = await registerUser({ ...data, dateOfBirth: dateOfBirth })
            console.log('Registration response:', response)
            if (response) {
                navigate('/dashboard')
                toast.success('Registration successful!', { autoClose: 3000 })
            }
            else {
                toast.error('Registration failed. Please check your information.', { autoClose: 3000 })
            }
        }
        catch (error) {
            console.error('Registration error:', error)
            toast.error('An error occurred. Please try again later.', { autoClose: 3000 })
        }
    }

    return (
        <ThemeProvider theme={createTheme()}>
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="given-name"
                            autoFocus
                            {...register('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName ? errors.firstName.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            {...register('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName ? errors.lastName.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="dateOfBirth"
                                label="Date of Birth (MM/DD/YYYY)"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth ? errors.dateOfBirth.message : ''}
                                />
                            </Grid>
                    </Grid>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                    >
                    Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="#" variant="body2">
                        Already have an account? Sign in
                        </Link>
                    </Grid>
                    </Grid>
                </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Register