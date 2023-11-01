import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetBudgetByUser } from '../../hooks/budgetHook'

import BudgetTable from '../../components/budget/BudgetTable'
import CreateBudget from '../../components/budget/CreateBudget'
import BudgetGoals from '../../components/budget/BudgetGoals'
import BarGraph from '../../components/budget/BarGraph'
import CategoryAllocationBar from '../../components/budget/CategoryAllocationBar'

import { Box, CssBaseline, Container, Paper, Grid, Typography, Link, Divider, Toolbar } from '@mui/material'

const Budget = () => {

    const paperStyle = {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '240px'
    }

    const [selectedBudget, setSelectedBudget] = useState(null)
    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const {
        data: budgetData,
        isLoading: budgetLoading,
        isError
    } = useGetBudgetByUser(userState?.userInfo?.token)

    if (budgetLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching savings</div>
    }

    const handleEditCancel = () => {
        setSelectedBudget(null)
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <BudgetTable setSelectedBudget={setSelectedBudget} data={budgetData} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <CreateBudget selectedBudget={selectedBudget} onEditCancel={handleEditCancel} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <BudgetGoals budgetData={budgetData} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <BarGraph budgetData={budgetData} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={paperStyle}>
                    <CategoryAllocationBar budgetData={budgetData} />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Budget