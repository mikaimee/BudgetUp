const Category = require('../model/Category')

const createCategory = async (req, res) => {
    try {
        const { name } = req.body

        const category = new Category({name})

        await category.save()
        return res.status(201).json({ category })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const updatedCategoryData = req.body

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true })

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' })
        }
        return res.status(200).json({ category: updatedCategory })
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const result = await Category.deleteOne({ _id: categoryId })
        if (!result) {
            return res.status(404).json({ message: 'Category not found' })
        }
        res.status(200).json({ messgae: "Category deleted successfully" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting category"})
    }
}

const allCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        if (!categories) {
            return res.status(404).json({ message: 'There are no categories' })
        }
        return res.status(200).json({ categories })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retrieving all category"})
    }
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    allCategories
}