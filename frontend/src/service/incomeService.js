import axios from 'axios'

export const createIncome = async ({
    source,
    amount,
    frequecy,
    dateReceived,
    isRecurring,
    categoryId,
    token
}) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const { data } = await axios.post('http://localhost:8000/incomes', {
            source,
        amount,
        frequecy,
        dateReceived,
        isRecurring,
        categoryId
        }, { headers }) 
        return data
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}

export const updateIncome = async ({ incomeId, updatedIncomeData, token }) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const { data } = await axios.put(`http://localhost:8000/incomes/${incomeId}`, updatedIncomeData, { headers })
        return data
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}

export const deleteIncome = async({ incomeId, token }) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const { data } = await axios.delete(`http://localhost:8000/incomes/${incomeId}`, { headers })
        return data
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}


//WIP
export const getAllIncomeByUser = async (token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }

        const { data } = await axios.get('http://localhost:8000/incomes/byUser', { headers })
        return data.incomeRecords
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}

// WIP
export const calculateTotalIncomeByDateRange = async( token, startDate, endDate ) => {
    try {
        const headers = {
        Authorization: `Bearer ${token}`
        }

        const params = { startDate, endDate }

        const { data } = await axios.get('http://localhost:8000/incomes/calculate', { headers, params })
        return data.totalIncome
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}