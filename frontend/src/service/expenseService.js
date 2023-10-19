import axios from 'axios'

export const createExpense = async ({
    vendor, amount, method, dateOfExpense, isRecurring, categoryId, token
}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const requestData = { vendor, amount, method, dateOfExpense, isRecurring, categoryId }
        
        const response  = await axios.post('http://localhost:8000/expenses', 
            requestData,
            config
        )
        if (response.status === 201) {
            return response.data
        } 
        else {
            throw new Error(`Failed to create an expense. Status: ${response.status}`)
        }
    }
    catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message)
        } 
        else {
            throw error
        }
    }
}

export const getAllExpenseByUser = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.get('http://localhost:8000/expenses/byUser', config)
        if (response.status === 200) {
            return response.data.expenseRecords
        }
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}

export const updateExpense = async ( { expenseId, updatedExpenseData, token } ) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        // console.log("Sending update request with data (SERVICE): ", updatedExpenseData)
        const response = await axios.put(`http://localhost:8000/expenses/${expenseId}`, updatedExpenseData, config)
        // console.log("Received response (SERVICE): ", response)

        if (response.status === 200) {
            // console.log("From service data: ", response.data.expense)
            return response.data.expense
        }
        else {
            throw new Error(`Update failed with status code: ${response.status}`)
        }
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(`Update failed: ${err.response.data.message}`);
        } 
        else {
            throw new Error(`Update request failed: ${err.message}`);
        }
    }
}

export const deleteExpense = async({ expenseId, token}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.delete(`http://localhost:8000/expenses/${expenseId}`, config)
        return response.data
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(`Delete failed: ${err.response.data.message}`);
        } 
        else {
            throw new Error(`Delete request failed: ${err.message}`);
        }
    }
}

// WIP
export const searchExpense = async (keyword, token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const response = await axios.get('http://localhost:8000/expenses/search', { 
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