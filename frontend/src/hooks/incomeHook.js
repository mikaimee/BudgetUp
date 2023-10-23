import {
    createIncome,
    getAllIncomeByUser,
    updateIncome,
    deleteIncome,
    searchIncome
} from '../service/incomeService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useState } from 'react'

export const useCreateIncomeMutation = (queryClient) => {
    return useMutation(
        (incomeData) => createIncome(incomeData),
        {
            onSuccess: async (data) => {
                console.log(data)
                queryClient.invalidateQueries('incomesByUser')
                toast.success('Income created successfully')
            },
            onError: (error) => {
                toast.error(error.message)
                console.error(error)
            }
        }
    )
}

export const useGetIncomesByUser = (token) => {
    return useQuery(['incomesByUser'], () => getAllIncomeByUser(token), {
        onSuccess: (data) => {
            console.log('Incomes by user: ', data)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })
}

export const useUpdateIncomeMutation = (queryClient, onEditCancel) => {
    return useMutation(
        ({ incomeId, updatedIncomeData, token }) => {
            return updateIncome({ incomeId, updatedIncomeData, token})
        },
        {
            onSuccess: (data) => {
                if (data) {
                    queryClient.invalidateQueries('incomesByUser')
                    console.log('Updated Incomes: ', data)
                    toast.success('Income updated successfully')
                    onEditCancel()
                }
                else {
                    toast.error('Failed to update income')
                }
            },
            onError: (error) => {
                toast.error('Error updating income', error.message)
                console.error(error)
            }
        }
    )
}

export const useDeleteIncomeMutation = (queryClient) => {
    return useMutation(
        ({ incomeId, token }) => deleteIncome({ incomeId, token }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('incomesByUser')
                toast.success("Successfully deleted")
            },
            onError: (error) => {
                toast.error('Error deleting income', error.message)
                console.error(error)
            }
        }
    )
}

export function useSearch() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchResults, setSearchResults] = useState([])

    const searchIncomeRecords = async({ keyword, token }) => {
        setIsLoading(true)
        setError(null)

        try {
            const results = await searchIncome(keyword, token)
            console.log("Search Results: ", results)
            setSearchResults(results)
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            if (error.message === 'Token is missing') {
                console.error('Token is missing. Make sure the token is provided.');
            } else {
                console.error('Error from searchIncomeRecords:', error);
            }

            throw error
        }
    }
    return { searchIncomeRecords, isLoading, error, searchResults}
}