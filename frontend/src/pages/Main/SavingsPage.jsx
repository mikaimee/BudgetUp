import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetSavingsByUser } from '../../hooks/savingsHook'

import AddSavings from '../../components/savings/AddSavings'
import SavingsList from '../../components/savings/SavingsList'
import SavingsHistory from '../../components/savings/SavingsHistory'
import SavingsAnalytics from '../../components/savings/SavingsAnalytics'

import { Box, CssBaseline, Container, Paper, Grid, Typography, Link, Divider, Toolbar } from '@mui/material'

const SavingsPage = () => {

    const paperStyle = {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '240px'
    }

    const [selectedSavings, setSelectedSavings] = useState(null)
    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const {
        data: savingsData,
        isLoading: savingsLoading,
        isError
    } = useGetSavingsByUser(userState?.userInfo?.token)

    if (savingsLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching savings</div>
    }

    const handleEditCancel = () => {
        setSelectedSavings(null)
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <SavingsList setSelectedSavings={setSelectedSavings} data={savingsData} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <AddSavings selectedSavings={selectedSavings} onEditCancel={handleEditCancel} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <SavingsHistory data={savingsData} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <SavingsAnalytics data={savingsData} />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default SavingsPage