import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/authHook' 
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
    Typography,
    Avatar,
    Link,
    Container,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CssBaseline from '@mui/material/CssBaseline'

const Login = () => {

    const navigate = useNavigate()
    const { login, isLoading } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        const { email, password } = data
        try {
            const response = await login(email, password)
            if (response) {
                navigate('/dashboard')
                toast.success('Login successful!', { autoClose: 3000 })
            }
            else {
                toast.error('Login failed. Please check your credentials.', { autoClose: 3000 })
            }
        }
        catch (error) {
            console.error(error)
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ''}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                            />
                            <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Login