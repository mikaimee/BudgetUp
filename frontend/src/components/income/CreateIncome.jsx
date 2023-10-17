import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIncome } from '../../hooks/incomeHook'
import { useSelector } from 'react-redux'
import { useCategory } from '../../hooks/categoryHook'
import toast from 'react-hot-toast'

const CreateIncome = () => {

    const { createNewIncome, isLoading: incomeIsLoading, error: incomeError } = useIncome()
    const userState = useSelector((state) => state.user)
    const { categories, fetchAllCategories, isLoading: categoryIsLoading } = useCategory()

    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm()

    const [filteredCategories, setFilteredCategories] = useState([])
    const selectedType = 'income'

    useEffect(() => {
        fetchAllCategories()
    },[])

    useEffect(() => {
        setFilteredCategories(categories.filter(category => category.type === selectedType))
    }, [selectedType, categories])
    
    const onSubmit = async (data) => {

        try {
            const response = await createNewIncome({
                source: data.source,
                amount: data.amount,
                frequency: data.frequency,
                dateReceived: data.dateReceived,
                isRecurring: data.isRecurring,
                categoryId: data.categoryId,
                description: data.descripion,
                token: userState?.userInfo?.token
            })
            console.log("Income created:", response)
        }
        catch (error) {
            console.error("Error creating income:", error)
        }
    }

    return (
        <div>
            <h2>Create Income </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Source</label>
                    <input type='text' {...register("source", { required: true })} />
                    {errors.source && <p>This field is required</p>}
                </div>
                <div>
                    <label>Amount</label>
                    <input type='number' {...register("amount", { required: true })} />
                    {errors.amount && <p>This field is required</p>}
                </div>
                <div>
                    <label>Frequency</label>
                    <input type='text' {...register("frequency", { required: true })} />
                    {errors.frequency && <p>This field is required</p>}
                </div>
                <div>
                    <label>Date</label>
                    <input type='date' {...register("date", { required: true })} />
                    {errors.date && <p>This field is required</p>}
                </div>
                <div>
                    <label>Description</label>
                    <input type='description' {...register("description", { required: true })} />
                    {errors.description && <p>This field is required</p>}
                </div>
                <div>
                    <label>Recurring</label>
                    <input type='checkbox' {...register("isRecurring")} />
                    {errors.isRecurring && <p>This field is required</p>}
                </div>
                <div>
                    <label>Category</label>
                    <select {...register("categoryId", { required: true })}>
                        {filteredCategories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <p>This field is required.</p>}
                </div>
                <button type="submit">Create Income</button>
            </form>
        </div>
    )
}

export default CreateIncome