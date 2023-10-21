import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { useSearch } from '../../hooks/expenseHook'

const SearchExpense = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const userState = useSelector((state) => state.user)
    const { searchExpenseRecords, isLoading, error, searchResults } = useSearch()

    const handleSearch = () => {
        try {
            if (!userState?.userInfo?.token) {
                throw new Error('Token is missing or invalid.');
            }

            searchExpenseRecords({ keyword: searchTerm, token: userState?.userInfo?.token });
        } catch (error) {
            // Handle the token-related error
            console.error('Token Error:', error.message);
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            
            {searchResults.length > 0 && (
                <ul>
                    {searchResults.map((result) => (
                        <li key={result._id}>{result.vendor}</li>
                    ))}
                </ul>
            )}
        </div>
    )

}


export default SearchExpense