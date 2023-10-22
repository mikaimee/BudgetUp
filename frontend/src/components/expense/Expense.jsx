import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetExpensesByUser } from '../../hooks/expenseHook'
import { ResponsivePie } from '@nivo/pie';

import CreateExpense from './CreateExpense'
import TableExpense from './TableExpense'
import SearchExpense from './SearchExpense'
import ExpensePie from './ExpensePie'

const Expense = () => {
    const [selectedExpense, setSelectedExpense] = useState(null)
    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user)

    const {
        data: expenseData,
        isLoading: expenseLoading,
        isError
    } = useGetExpensesByUser(userState?.userInfo?.token)

    console.log('expense!')
    console.log("FROM EXPENSE.JSX", expenseData)

    if (expenseLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching expenses</div>;
    }

    const handleEditCancel = () => {
        setSelectedExpense(null)
    }


    return (
        <div>
            <CreateExpense selectedExpense={selectedExpense} onEditCancel={handleEditCancel} />
            <TableExpense setSelectedExpense={setSelectedExpense} data={expenseData} />
            <SearchExpense />
            <ExpensePie data={expenseData} />
        </div>
    )
}

export default Expense