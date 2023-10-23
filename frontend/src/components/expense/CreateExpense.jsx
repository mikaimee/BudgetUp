import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '../../hooks/expenseHook'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useAllCategories } from '../../hooks/categoryHook'

import { TextField, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, MenuItem } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box';

const CreateExpense = ({ selectedExpense, onEditCancel }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const initialExpenseData ={
        vendor: '',
        amount: 0,
        method: 'Credit Card',
        dateOfExpense: '',
        isRecurring: false,
        categoryId: '', // Default to an empty string
        token: userState?.userInfo?.token
    }

    const [expenseData, setExpenseData] = useState(initialExpenseData)
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    // State to store selected category
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useAllCategories()

    // handle edit cancel button
    const handleEditCancel = () => {
        // Clear the selectedExpense from parent component
        onEditCancel()
        // Reset thr form data to its initial state
        setExpenseData(initialExpenseData)
        setIsUpdateMode(false)
        setSelectedCategoryId('')
    }

    // Effect to update the form when selectedExpense changes
    useEffect(() => {
        if (selectedExpense) {
            setExpenseData(selectedExpense)
            setSelectedCategoryId(selectedExpense.categoryId)
            setIsUpdateMode(true)
        }
        else {
            setExpenseData(initialExpenseData)
            setSelectedCategoryId('')
            setIsUpdateMode(false)
        }
    }, [selectedExpense])

    const { isLoading: createLoading, mutate: createMutate } = useCreateExpenseMutation(queryClient)
    const { isLoading: updateLoading, mutate: updateMutate } = useUpdateExpenseMutation(queryClient, onEditCancel)

    const handleCreateOrUpdateExpense = async (e) => {
        e.preventDefault()
        if (expenseData.categoryId.trim() === '') {
            return
        }

        if (isUpdateMode) {
            try {
                if (!selectedExpense || !selectedExpense._id) {
                    return
                }

                // Format the date to match 'yyyy-MM-dd' before sending request
                const rawDate = new Date(expenseData.dateOfExpense)
                const year = rawDate.getFullYear()
                const month = String(rawDate.getMonth() + 1).padStart(2, '0')
                const day = String(rawDate.getDate()).padStart(2, '0')
                const formattedDate = `${year}-${month}-${day}`
                
                const updatedExpenseData = {
                    ...expenseData, 
                    dateOfExpense: formattedDate,
                    token: userState?.userInfo?.token,
                    _id: selectedExpense._id,
                    categoryId: selectedCategoryId,
                }

                updateMutate({
                    expenseId: selectedExpense._id,
                    updatedExpenseData,
                    token: userState?.userInfo?.token
                })
            }
            catch (error) {
                toast.error(error.message)
                console.error(error)
            }
        }
        else {
            try {
                if (!selectedCategoryId) {
                    // Handle the case where no category is selected.
                    console.log('Category not selected')
                    toast.error('Please select a category')
                    return
                }
                const createdExpenseData = {
                    ...expenseData,
                    categoryId: selectedCategoryId,
                }
                
                const result = await createMutate(createdExpenseData)
                setExpenseData(initialExpenseData)
            }
            catch (error) {
                console.error(error)
                toast.error(error.message)
            }
        }
    }

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div>
                <Typography component='h2' variant='h5'>
                    {isUpdateMode ? 'Update Expense' : 'Create Expense'}
                </Typography>
                <form>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='vendor'
                        label="Vendor"
                        name='vendor'
                        autoComplete='vendor'
                        autoFocus
                        value={expenseData.vendor}
                        onChange={(e) => setExpenseData({ ...expenseData, vendor: e.target.value })}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='amount'
                        label="Amount"
                        name='amount'
                        type="number"
                        value={expenseData.amount}
                        onChange={(e) => setExpenseData({ ...expenseData, amount: parseFloat(e.target.value) })}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='method'
                        label="Method"
                        name='method'
                        value={expenseData.method}
                        onChange={(e) => setExpenseData({ ...expenseData, method: e.target.value })}
                    >
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Debit Card">Debit Card</MenuItem>
                    </TextField>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="date"
                        label="Date"
                        type="date"
                        id="date"
                        value={expenseData.dateOfExpense}
                        onChange={(e) => setExpenseData({ ...expenseData, dateOfExpense: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={expenseData.isRecurring}
                                onChange={(e) => setExpenseData({ ...expenseData, isRecurring: e.target.checked })}
                            />
                        }
                        label="Is Recurring"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        select
                        label="Category Name"
                        name="categoryId"
                        id="categoryId"
                        value={selectedCategoryId}
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value);
                            setExpenseData({ ...expenseData, categoryId: e.target.value });
                        }}
                    >
                        <MenuItem value="">Select a category</MenuItem>
                        {categoriesLoading ? (
                            <MenuItem>Loading categories...</MenuItem>
                        ) : categoriesError ? (
                            <MenuItem>Error loading categories</MenuItem>
                        ) : (
                            categories
                                .filter((category) => category.type === 'expense')
                                .map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))
                        )}
                    </TextField>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleCreateOrUpdateExpense}
                        disabled={isUpdateMode ? updateLoading : createLoading}
                    >
                        {isUpdateMode ? (updateLoading ? 'Updating...' : 'Update Expense') : (createLoading ? 'Creating...' : 'Create Expense')}
                    </Button>
                    {isUpdateMode && (
                        <Box mt={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={handleEditCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </form>
            </div>
        </Container>
    )
}

export default CreateExpense