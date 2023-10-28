import React from 'react'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const SavingsFilter = ({ filterCriteria, setFilterCriteria }) => {

    const handleDateFromChange = (event) => {
        setFilterCriteria({ ...filterCriteria, dateFrom: event.target.value });
    }

    const handleDateToChange = (event) => {
        setFilterCriteria({ ...filterCriteria, dateTo: event.target.value });
    }

    const handleStatusChange = (e)=> {
        setFilterCriteria({...filterCriteria, status: e.target.value})

    }

    return (
        <div>
            <TextField
                type="date"
                label="Date From"
                value={filterCriteria.dateFrom}
                onChange={handleDateFromChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                type="date"
                label="Date To"
                value={filterCriteria.dateTo}
                onChange={handleDateToChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                select
                label="Status"
                value={filterCriteria.status}
                onChange={handleStatusChange}
                variant="outlined"
            >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Yet to Start">Yet to Start</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Abandoned">Abandoned</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
            </TextField>
        </div>
    )
}

export default SavingsFilter