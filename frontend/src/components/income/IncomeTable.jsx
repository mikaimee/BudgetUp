import React, { useEffect, useState } from 'react'
import { useIncome } from '../../hooks/incomeHook'
import { useSelector } from 'react-redux'
import CreateIncome from './CreateIncome'
import IncomeFilter from './IncomeFilter'

const IncomeTable = () => {

    const userState = useSelector((state) => state.user)
    const { fetchAllIncomeByUser, isLoading, error, incomeRecords } = useIncome()
    
    const [filteredIncomeRecords, setFilteredIncomeRecords] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        categoryId: '',
        startDate: '',
        endDate: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAllIncomeByUser({ token: userState?.userInfo?.token });
                setFilteredIncomeRecords(response)
            }
            catch (error){
                console.log("THere is an error", error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
    // Apply filters
        let filteredRecords = [...incomeRecords];
        if (filterCriteria.categoryId) {
            filteredRecords = filteredRecords.filter((record) => record.categoryId === filterCriteria.categoryId);
        }
        if (filterCriteria.startDate && filterCriteria.endDate) {
            filteredRecords = filteredRecords.filter((record) => {
            const recordDate = new Date(record.dateReceived);
            const startDate = new Date(filterCriteria.startDate);
            const endDate = new Date(filterCriteria.endDate);
            return recordDate >= startDate && recordDate <= endDate;
            });
        }

        setFilteredIncomeRecords(
            Object.values(filterCriteria).some((criteria) => criteria)
            ? filteredRecords
            : incomeRecords
        );
    }, [filterCriteria, incomeRecords]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const formatShortDate = (fullDate) => {
        const date = new Date(fullDate)
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${month}/${day}`
    }

    const resetFilter = () => {
        setFilterCriteria({
            categoryId: '',
            startDate: '',
            endDate: '',
        })
    }

    return (
        <div>
            <h2>Income</h2>
            <button onClick={resetFilter}>Reset</button> {/* Add the Reset button */}
            <IncomeFilter onFilter={setFilterCriteria} />
            {incomeRecords.length === 0 ? (
                <p>No income</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Source</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncomeRecords.map((record) => (
                            <tr key={record?._id}>
                                <td>{formatShortDate(record?.dateReceived)}</td>
                                <td>{record?.source}</td>
                                <td>${record?.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default IncomeTable