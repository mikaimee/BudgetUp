import axios from 'axios'

export const createIncome = async ({
    source,
    amount,
    frequecy,
    dateReceived,
    isRecurring,
    categoryId,
    description,
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
            categoryId,
            description
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


export const getAllIncomeByUser = async (token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }

        const response = await axios.get('http://localhost:8000/incomes/byUser', { headers })
        if (response.status === 200) {
            return response.data.incomeRecords
        }
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

export const searchIncome = async (keyword, token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const response = await axios.get('http://localhost:8000/incomes/search', {
            params: { keyword },
            headers
        })
        return response.data.searchResults
    }
    catch (err) {
        if (err.response) {
            // The request was made, but the server responded with an error
            if (err.response.status === 401) {
                throw new Error('Unauthorized: Token is invalid or expired.');
            } else {
                throw new Error(`Server Error: ${err.response.status}`);
            }
        } else if (err.request) {
            // The request was made, but there was no response (e.g., network issue)
            throw new Error('No response from the server. Check your network connection.');
        } else {
            // Something else went wrong
            throw new Error('An error occurred while making the request.');
        }
    }
}

export const getIncomeCategories = async ({token}) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const response = await axios.get('http://localhost:8000/incomes/groupByCategory', headers)
        return response.data.incomeCategories
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}