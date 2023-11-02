import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetIncomesByUser } from '../../hooks/incomeHook'
import { useGetExpensesByUser } from '../../hooks/expenseHook'
import { useGetSavingsByUser } from '../../hooks/savingsHook'
import { useGetBudgetByUser } from '../../hooks/budgetHook'

import IncExpBar from '../../components/dashboard/IncExpBar'
import TotalIncome from '../../components/dashboard/TotalIncome'
import TotalExpense from '../../components/dashboard/TotalExpense'
import YearlyExpensePie from '../../components/expense/YearlyExpensePie'
import BarGraph from '../../components/budget/BarGraph'
import SavingsList from '../../components/savings/SavingsList'

import { Box, CssBaseline, Container, Paper, Grid, Typography, Link, Divider, Toolbar } from '@mui/material'

const DashboardPage = () => {

    const paperStyle = {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '240px'
    }

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)
    const [selectedSavings, setSelectedSavings] = useState(null)

    const {
        data: incomeData,
        isLoading: incomeLoading,
        isError: incomeError
    } = useGetIncomesByUser(userState?.userInfo?.token)
    
    const {
        data: expenseData,
        isLoading: expenseLoading,
        isError: expenseError
    } = useGetExpensesByUser(userState?.userInfo?.token)

    const {
        data: savingsData,
        isLoading: savingsLoading,
        isError: savingsError
    } = useGetSavingsByUser(userState?.userInfo?.token)

    const {
        data: budgetData,
        isLoading: budgetLoading,
        isError: budgetError
    } = useGetBudgetByUser(userState?.userInfo?.token)

    if (incomeLoading || expenseLoading || savingsLoading || budgetLoading) {
        return <div>Loading...</div>
    }

    if (incomeError || expenseError || savingsError || budgetError) {
        return <div>Error fetching data</div>
    }


    return (
        <Grid container spacing={3}>
            <Typography variant='h3'>
                Welcome {userState.userInfo.firstName}
            </Typography>
            <Grid item xs={10} md={11.5}>
                <Paper sx={paperStyle}>
                    <IncExpBar incomeData={incomeData} expenseData={expenseData} />
                </Paper>
                <Paper sx={paperStyle}>
                    <TotalIncome incomeData={incomeData} />
                </Paper>
                <Paper sx={paperStyle}>
                    <TotalExpense expenseData={expenseData} />
                </Paper>
            </Grid>
            <Grid item xs={10} md={11.5}>
                <Paper sx={paperStyle}>
                    <YearlyExpensePie data={expenseData} />
                </Paper>
                <Paper sx={paperStyle}>
                    <BarGraph budgetData={budgetData} />
                </Paper>
            </Grid>
            <Grid item xs={10} md={11.5}>
                <Paper sx={paperStyle}>
                    <SavingsList setSelectedSavings={setSelectedSavings} data={savingsData} />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default DashboardPage