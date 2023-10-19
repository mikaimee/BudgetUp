import { 
    calculateTotalIncomeByDateRange, 
    filterIncomeByCategory, 
    createIncome, 
    deleteIncome, 
    getAllIncomeByUser, 
    searchIncome, 
    updateIncome, 
    getIncomeCategories 
} from '../service/incomeService'
import { useState } from 'react'

export function useIncome() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [incomeRecords, setIncomeRecords] = useState([])
    const [totalIncome, setTotalIncome] = useState(null)
    const [searchResults, setSearchResults] = useState([])
    const [filteredIncomes, setFilteredIncomes] = useState([])

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

    const filterIncomeByCategory = async ({ categoryId, token }) => {
        setIsLoading(true)
        setError(null)

        try {
            const results = await filterIncomeByCategory(categoryId, token)
            console.log("Filtered Results: ", results)
            setFilteredIncomes(results)
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            if (error.message === 'Token is missing') {
                console.error('Token is missing. Make sure the token is provided.');
            } else {
                console.error('Error filtering incomes:', error);
            }
            throw error
        }
    }

    return { 
        isLoading,
        error,
        fetchAllIncomeByUser, incomeRecords,
        searchIncomeRecords, searchResults,
        filterIncomeByCategory, filteredIncomes
    }
}