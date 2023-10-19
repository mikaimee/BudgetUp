import React, { useState } from 'react'
import CreateExpense from './CreateExpense'
import TableExpense from './TableExpense'

const Expense = () => {
    const [selectedExpense, setSelectedExpense] = useState(null)

    const handleEditCancel = () => {
        setSelectedExpense(null)
    }

    return (
        <div>
            <CreateExpense selectedExpense={selectedExpense} onEditCancel={handleEditCancel} />
            <TableExpense setSelectedExpense={setSelectedExpense} />
        </div>
    )
}

export default Expense