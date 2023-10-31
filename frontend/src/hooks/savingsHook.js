import {
    createSavings,
    savingsByUser,
    updateSavings,
    deleteSavings,
    addContributions,
    deleteContribution
} from '../service/savingsService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useState } from 'react'

export const useCreateSavingsMutation = (queryClient) => {
    return useMutation(
        (savingsData) => createSavings(savingsData),
        {
            onSuccess: async (data) => {
            // Handle the success case
            console.log(data)
            queryClient.invalidateQueries('savingsByUser')
            toast.success('Savings created successfully')
            },
            onError: (error) => {
            // Handle the error case
            toast.error(error.message)
            console.error(error)
            }
        }
    )
}

export const useGetSavingsByUser = (token) => {
    return useQuery(['savingsByUser'], () => savingsByUser(token), {
        onSuccess: (data) => {
            // console.log('Expenses by user: ', data)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })
}

export const useUpdateSavingsMutation = (queryClient, onEditCancel) => {
    return useMutation(
        ({ savingsId, updatedSavingsData, token }) => {
            return updateSavings({ savingsId, updatedSavingsData, token})
        },
        {
            onSuccess: (data) => {
                if (data) {
                    queryClient.invalidateQueries('savingsByUser')
                    console.log('Updated Savings: ', data)
                    toast.success('Savings updated successfully')
                    onEditCancel()
                }
                else {
                    toast.error('Failed to update savings')
                }
            },
            onError: (error) => {
                toast.error('Error updating income', error.message)
                console.error(error)
            }
        }
    )
}

export const useDeleteSavingsMutation = (queryClient) => {
    return useMutation(
        ({ savingsId, token }) => deleteSavings({ savingsId, token }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('savingsByUser')
                toast.success("Successfully deleted")
            },
            onError: (error) => {
                toast.error('Error deleting savings', error.message)
                console.error(error)
            }
        }
    )
}

export const useAddContributionMutation = (queryClient) => {
    return useMutation(
        ({ savingsId, contributionData, token }) => {
            const parsedAmount = parseFloat(contributionData.amount)
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount');
            }
            contributionData.amount = parsedAmount
            return addContributions({ savingsId, contributionData, token })
        },
        {
            onSuccess: (data) => {
                if (data) {
                    queryClient.invalidateQueries('savingsByUser')
                    console.log('Updated Savings: ', data)
                    toast.success('Added Contribution successfully')
                }
                else {
                    toast.error('Failed to add contribution')
                }
            },
            onError: (error) => {
                toast.error('Error adding contribution', error.message)
                console.error(error)
            }
        }
    )
}

export const useDeleteContributionsMutation = (queryClient) => {
    return useMutation(
        ({ savingsId, contributionId, token }) => deleteContribution({ savingsId, contributionId, token }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('savingsByUser')
                toast.success("Successfully deleted contribution")
            },
            onError: (error) => {
                toast.error('Error deleting savings', error.message)
                console.error(error)
            }
        }
    )
}