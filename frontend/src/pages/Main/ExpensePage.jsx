import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetExpensesByUser } from '../../hooks/expenseHook'

import CreateExpense from '../../components/expense/CreateExpense'
import TableExpense from '../../components/expense/TableExpense'
import SearchExpense from '../../components/expense/SearchExpense'
import ExpensePie from '../../components/expense/ExpensePie'
import YearlyExpensePie from '../../components/expense/YearlyExpensePie'

const ExpensePage = () => {

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
            <TableExpense 
                setSelectedExpense={setSelectedExpense} 
                data={expenseData} 
                filteredExpenses={filteredExpenses}
                setFilteredExpenses={setFilteredExpenses}
            />
            <SearchExpense />
            <ExpensePie data={filteredExpenses} />
            <YearlyExpensePie data={expenseData} />
        </div>
    )
}

export default ExpensePage