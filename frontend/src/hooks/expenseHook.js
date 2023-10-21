import { 
    createExpense, 
    getAllExpenseByUser, 
    updateExpense,
    deleteExpense,
    searchExpense
} from "../service/expenseService";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useState } from 'react'

export const useCreateExpenseMutation = (queryClient) => {
    return useMutation(
        (expenseData) => createExpense(expenseData), // Call service function
        {
            onSuccess: async (data) => {
            // Handle the success case
            console.log(data)
            queryClient.invalidateQueries('expensesByUser')
            toast.success('Expense created successfully')
            },
            onError: (error) => {
            // Handle the error case
            toast.error(error.message)
            console.error(error)
            }
        }
    )
}

export const useGetExpensesByUser = (token) => {
    return useQuery(['expensesByUser'], () => getAllExpenseByUser(token), {
        onSuccess: (data) => {
            // console.log('Expenses by user: ', data)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })
}

export const useUpdateExpenseMutation = (queryClient, onEditCancel) => {
    return useMutation(
        ({ expenseId, updatedExpenseData, token }) => {
            // console.log("Attempting to update expense with data (HOOK): ", expenseId, updatedExpenseData, token )
            return updateExpense({ expenseId, updatedExpenseData, token })
        },
        {
            onSuccess: (data) => {
                if (data) {
                    // console.log("Successfully updated expense with data (HOOK): ", data)
                    queryClient.invalidateQueries('expensesByUser')
                    console.log('Updated Expense: ', data)
                    toast.success('Expense updated successfully')
                    onEditCancel()
                }
                else {
                    toast.error('Failed to update expense')
                }
            },
            onError: (error) => {
                console.error('Error updating expense', error)
                toast.error(error.message)
            }
        }
    )
}

export const useDeleteExpenseMutation = (queryClient) => {
    return useMutation(
        ({ expenseId, token }) => deleteExpense({ expenseId, token }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('expensesByUser')
                toast.success("Successfully deleted")
            },
            onError: (error) => {
                console.error('Error deleting expense', error)
                toast.error(error.message)
            }
        }
    )
}


export function useSearch() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchResults, setSearchResults] = useState([])

    const  searchExpenseRecords = async ({ keyword, token }) => {

        setIsLoading(true)
        setError(null)

        try {
            const results = await searchExpense(keyword, token)
            console.log("Search Results: ", results)
            setSearchResults(results)
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            if (error.message === 'Token is missing') {
                console.error('Token is missing. Make sure the token is provided.');
            } else {
                console.error('Error from searchExpenseRecords:', error);
            }

            throw error
        }
    }
    return {searchExpenseRecords, isLoading, error, searchResults}
}