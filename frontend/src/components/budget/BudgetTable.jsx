import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteBudgetMutation, useAddCategoryMutation } from '../../hooks/budgetHook'
import { useAllCategories } from '../../hooks/categoryHook'

import { FormControl, MenuItem, Select, InputLabel, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import ClearIcon from '@mui/icons-material/Clear'
import AddIcon from '@mui/icons-material/Add'

// Function for format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
// Function to format $
const formatAmount = (amount) => {
    return amount.toFixed(2)
}

const BudgetTable = ({ data, setSelectedBudget }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const initialCategoryData = {
        categoryId: '',
        allocatedAmount: 0
    }

    // For the notes
    const [isOpen, setIsOpen] = useState(false)

    // For adding category + its allocated amount
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
    const [categoryData, setCategoryData] = useState(initialCategoryData)
    const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(null)

    const { data: allCategories } = useAllCategories()
    const { mutate: addCategory } = useAddCategoryMutation(queryClient)
    const { mutate: deleteMutate } = useDeleteBudgetMutation(queryClient)

    // Sort the data by the most recent
    data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))

    // Function to handle delete button
    const handleDelete = (budgetId) => {
        console.log('Attempting to delete budget with ID:', budgetId)
        // Show confirmation
        const confirmed = window.confirm("Are you sure you want to delete this budget? ")
        if (confirmed) {
            console.log('Deletion confirmed for budget with ID:', budgetId)
            deleteMutate({ budgetId, token: userState?.userInfo?.token })
        }
    }

    // Handle Opening and Closing of the notes
    const handleOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    // Handle Opening and Closing of Category Form
    const handleOpenCategoryForm = (index) => {
        setSelectedBudgetIndex(index)
        setIsCategoryFormOpen(true)
    }
    const handleCloseCategoryForm = () => {
        setIsCategoryFormOpen(false)
        setSelectedBudgetIndex(null)
        setCategoryData(initialCategoryData)
    }

    // Function to handle submission of category form
    const handleAddCategory = async (e) => {
        e.preventDefault()
        try {
            if (selectedBudgetIndex !== null) {
                const response = await addCategory({
                    budgetId: data[selectedBudgetIndex]._id,
                    categoryData,
                    token: userState?.userInfo?.token
                });
                if (response) {
                    handleCloseCategoryForm()
                    setCategoryData(initialCategoryData);
                }
            }
        } 
        catch (error) {
            console.error(error);
        }
    }

    // Function to calculate remaining amount for budget
    const calculateRemainingAmount = (budget) => {
        const totalAmount = parseFloat(budget.totalAmount) || 0
        const allocatedAmounts = budget.categories.map((c) => parseFloat(c.allocatedAmount) || 0)
        const sumAllocatedAmounts = allocatedAmounts.reduce((total, amount) => total + amount, 0)
        return totalAmount - sumAllocatedAmounts
    }

    return (
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Budget Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Category and Allocated Amount</TableCell>
                    <TableCell>Remaining Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Budget Type</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((budget, index) => (
                    <TableRow key={index}>
                        <TableCell>{budget.name}</TableCell>
                        <TableCell>{formatDate(budget.startDate)|| 'N/A'}</TableCell>
                        <TableCell>{formatDate(budget.endDate)|| 'N/A'}</TableCell>
                        <TableCell>${formatAmount(budget.totalAmount)|| 'N/A'}</TableCell>
                        <TableCell>
                            {budget.categories.map((category, catIndex) => (
                                <div key={catIndex}>
                                    {category.categoryId.name|| 'N/A'} - ${formatAmount(category.allocatedAmount|| 'N/A')}
                                    {catIndex < budget.categories.length - 1 && <hr />}
                                </div>
                            ))}
                            <IconButton onClick={() => handleOpenCategoryForm(index)}>
                                <AddIcon />
                            </IconButton>
                            <Dialog open={isCategoryFormOpen} onClose={handleCloseCategoryForm}>
                                <DialogTitle>Add Category</DialogTitle>
                                <DialogContent>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="category-select-label">Category</InputLabel>
                                        <Select
                                            labelId='category-select-label'
                                            id="category-select"
                                            value={categoryData.categoryId}
                                            onChange={(e) => setCategoryData({ ...categoryData, categoryId: e.target.value })}
                                            label="Category"
                                        >
                                        {allCategories?.filter((category) => category.type === 'expense').map((category) => (
                                            <MenuItem key={category._id} value={category._id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        label="Allocated Amount"
                                        variant="outlined"
                                        type="number"
                                        value={categoryData.allocatedAmount}
                                        onChange={(e) => setCategoryData({ ...categoryData, allocatedAmount: e.target.value })}
                                    />
                                </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseCategoryForm} color="primary">
                                                Cancel
                                        </Button>
                                        <Button onClick={handleAddCategory} color="primary">
                                            Add
                                        </Button>
                                </DialogActions>
                            </Dialog>
                        </TableCell>
                        <TableCell>${formatAmount(calculateRemainingAmount(budget)) || 'N/A'}</TableCell>
                        <TableCell>{budget.status|| 'N/A'}</TableCell>
                        <TableCell>{budget.bugetType|| 'N/A'}</TableCell>
                        <TableCell>
                            <IconButton onClick={handleOpen}>
                                <NoteIcon />
                            </IconButton>
                            <Dialog open={isOpen} onClose={handleClose}>
                                <IconButton
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                    }}
                                    onClick={handleClose}
                                >
                                    <ClearIcon />
                                </IconButton>
                                <DialogTitle>Notes</DialogTitle>
                                <DialogContent>
                                    {budget.notes || 'No notes'}
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell>
                            <Button onClick={() => setSelectedBudget(budget)}>
                                Edit
                            </Button>
                            <Button onClick={() => handleDelete(budget._id)} >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default BudgetTable