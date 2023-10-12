import axios from 'axios'
import { calculateTotalIncomeByDateRange, createIncome, deleteIncome, getAllIncomeByUser, updateIncome } from '../service/incomeService'

export function useIncome() {
    const [isLoading, setIsLoading] = useState(false)
    const [totalIncome, setTotalIncome] = useState(null)
    const [error, setError] = useState(null)

    const createNewIncome = async({
        source,
        amount,
        frequecy,
        dateReceived,
        isRecurring,
        categoryId,
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

    const fetchAllIncomeByUser = async (token) => {
        setIsLoading(true)
        try {
            const incomeRecords = await getAllIncomeByUser(token)
            console.log("Income Records: ", incomeRecords)
            setIsLoading(false)
            return incomeRecords
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from getAllIncomeByUser:', error)
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

    return { 
        createNewIncome,
        updateIncomeData,
        deleteIncomeItem,
        fetchAllIncomeByUser,
        calculateTotalIncomeByDate,
        isLoading
    }
}