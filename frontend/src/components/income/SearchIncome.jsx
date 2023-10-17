import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useIncome } from '../../hooks/incomeHook'

const SearchIncome = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const userState = useSelector((state) => state.user)
    const { searchIncomeRecords, isLoading, error, searchResults } = useIncome()

    const handleSearch = () => {
        try {
            if (!userState?.userInfo?.token) {
                throw new Error('Token is missing or invalid.');
            }

            searchIncomeRecords({ keyword: searchTerm, token: userState?.userInfo?.token });
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
                        <li key={result._id}>{result.source}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchIncome