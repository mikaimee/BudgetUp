import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetIncomesByUser } from '../../hooks/incomeHook'

import CreateIncome from '../../components/income/CreateIncome'
import IncomeTable from '../../components/income/IncomeTable'
import SearchIncome from '../../components/income/SearchIncome'

import { Box, CssBaseline, Container, Paper, Grid, Typography, Link, Divider, Toolbar } from '@mui/material'

const IncomePage = () => {

    const paperStyle = {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '240px'
    }

    const [selectedIncome, setSelectedIncome] = useState(null)
    const [filteredIncomes, setFilteredIncomes] = useState([])
    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user)

    const {
        data: incomeData,
        isLoading: incomeLoading,
        isError
    } = useGetIncomesByUser(userState?.userInfo?.token)
    
    if (incomeLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching incomes</div>
    }

    const handleEditCancel = () => {
        setSelectedIncome(null)
    }
    
    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={paperStyle}>
                        <CreateIncome selectedIncome={selectedIncome} onEditCancel={handleEditCancel} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={paperStyle}>
                        <IncomeTable 
                            setSelectedIncome={setSelectedIncome} 
                            data={incomeData} 
                            filteredIncomes={filteredIncomes}
                            setFilteredIncomes={setFilteredIncomes}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={paperStyle}>
                        <SearchIncome />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default IncomePage