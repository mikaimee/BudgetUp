import { calculateTotalIncomeByDateRange, createIncome, deleteIncome, getAllIncomeByUser, searchIncome, updateIncome, getIncomeCategories } from '../service/incomeService'
import { useState } from 'react'

export function useIncome() {
    const [isLoading, setIsLoading] = useState(false)
    const [incomeRecords, setIncomeRecords] = useState([])
    const [totalIncome, setTotalIncome] = useState(null)
    const [searchResults, setSearchResults] = useState([])
    const [error, setError] = useState(null)

    const createNewIncome = async({
        source,
        amount,
        frequecy,
        dateReceived,
        isRecurring,
        categoryId,
        description,
        token
    }) => {
        setIsLoading(true)
        try {
            const data = await createIncome({
                source,
                amount,
                frequecy,
                dateReceived,
                isRecurring,
                categoryId,
                description,
                token
            })
            console.log("Created Income Data: ", data)
            setIsLoading(false)
            return data
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from createIncome:', error)
            throw error
        }
    }

    const updateIncomeData = async ({ incomeId, updatedIncomeData, token }) => {
        setIsLoading(true)
        
        try {
            const data = await updateIncome({ incomeId, updatedIncomeData, token })
            console.log("Updated Income Data: ", data)
            setIsLoading(false)
            return data
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from updateIncome:', error)
            throw error
        }
    }

    const deleteIncomeItem = async({ incomeId, token }) => {
        setIsLoading(true)
        try {
            const data = await deleteIncome({ incomeId, token })
            console.log("Deleted Income Data: ", data)
            setIsLoading(false)
            return data
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from deleteIncome:', error)
            throw error
        }
    }

    const fetchAllIncomeByUser = async ({ token }) => {
        setIsLoading(true)
        setError(null)

        try {
            const records = await getAllIncomeByUser(token)
            console.log("Income Records: ", records)
            setIncomeRecords(records)
            setIsLoading(false)
            return records
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from getAllIncomeByUser:', error)
            setError(error)
            throw error
        }
    }

    const calculateTotalIncomeByDate = async(token, startDate, endDate) => {
        setIsLoading(true)
        try {
            const totalIncome = await calculateTotalIncomeByDateRange(token, startDate, endDate)
            console.log("Total Income Records: ", totalIncome)
            setIsLoading(false)
            return totalIncome
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from calculateTotalIncomeByDateRange:', error)
            throw error
        }
    }

    const searchIncomeRecords = async ({ keyword, token }) => {
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

    return { 
        createNewIncome,
        updateIncomeData,
        deleteIncomeItem,
        fetchAllIncomeByUser, incomeRecords,
        calculateTotalIncomeByDate,
        isLoading,
        error,
        searchIncomeRecords, searchResults
    }
}