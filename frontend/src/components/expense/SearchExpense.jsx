import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { useSearch } from '../../hooks/expenseHook'

import { TextField, Paper, Button, Grid, InputAdornment, Typography, Avatar, Link, Container, createTheme, ThemeProvider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box';

const tableHeadStyle = {
    fontWeight: 'bold'
};

const SearchExpense = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const userState = useSelector((state) => state.user)
    const [hasSearched, setHasSearched] = useState(false)

    const { searchExpenseRecords, isLoading, error, searchResults } = useSearch()

    const handleSearch = () => {
        try {
            if (!userState?.userInfo?.token) {
                throw new Error('Token is missing or invalid.')
            }

            searchExpenseRecords({ keyword: searchTerm, token: userState?.userInfo?.token })
            setHasSearched(true)
        } 
        catch (error) {
            // Handle the token-related error
            console.error('Token Error:', error.message)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Call handleSearch when the Enter key is pressed
            handleSearch();
        }
    }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <div>
                <Typography component='h2' variant='h5'>
                    Search Expenses
                </Typography>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Search keyword"
                    name="searchTerm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                                disabled={!searchTerm}
                            >
                                Search
                            </Button>
                        </InputAdornment>
                        )
                    }}
                />
                <div style={{ marginTop: '20px' }}>
                    {isLoading && <Typography>Loading...</Typography>}
                    {error && <Typography>Error: {error.message}</Typography>}
                </div>
                <div style={{ marginTop: '20px' }}>
                    {hasSearched && searchResults.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={tableHeadStyle}>Vendor</TableCell>
                                        <TableCell style={tableHeadStyle}>Date</TableCell>
                                        <TableCell style={tableHeadStyle}>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchResults.map((result) => (
                                        <TableRow key={result._id}>
                                            <TableCell>{result.vendor}</TableCell>
                                            <TableCell>{new Date(result.dateOfExpense).toLocaleDateString()}</TableCell>
                                            <TableCell>${result.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        hasSearched && <Typography>No expense records found for the given search term.</Typography>
                    )}
                </div>
            </div>
        </Container>
    )

}


export default SearchExpense