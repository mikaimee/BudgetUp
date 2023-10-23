import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetExpensesByUser } from '../../hooks/expenseHook'

import CreateExpense from '../../components/expense/CreateExpense'
import TableExpense from '../../components/expense/TableExpense'
import SearchExpense from '../../components/expense/SearchExpense'
import ExpensePie from '../../components/expense/ExpensePie'
import YearlyExpensePie from '../../components/expense/YearlyExpensePie'
import ExpenseLine from '../../components/expense/ExpenseLine'

import { Box, CssBaseline, Container, Paper, Grid, Typography, Link, Divider, Toolbar } from '@mui/material';

const ExpensePage = () => {

    const paperStyle = {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '240px'
    }

    const [selectedExpense, setSelectedExpense] = useState(null)
    const [filteredExpenses, setFilteredExpenses] = useState([])
    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user)

    const {
        data: expenseData,
        isLoading: expenseLoading,
        isError
    } = useGetExpensesByUser(userState?.userInfo?.token)

    if (expenseLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching expenses</div>
    }

    const handleEditCancel = () => {
        setSelectedExpense(null)
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={paperStyle}>
                        <CreateExpense selectedExpense={selectedExpense} onEditCancel={handleEditCancel} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={paperStyle}>
                        <TableExpense 
                            setSelectedExpense={setSelectedExpense} 
                            data={expenseData} 
                            filteredExpenses={filteredExpenses}
                            setFilteredExpenses={setFilteredExpenses}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={paperStyle}>
                        <SearchExpense />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={paperStyle}>
                        <ExpensePie data={filteredExpenses} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={paperStyle}>
                        <YearlyExpensePie data={expenseData} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Paper sx={paperStyle}>
                        <ExpenseLine data={expenseData} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default ExpensePage