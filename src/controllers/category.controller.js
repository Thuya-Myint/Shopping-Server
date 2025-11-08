const Category = require("../models/category.model")

const createCategory = async (req, res) => {

    try {
        const createdCategory = await Category.create(req.body)
        res.status(200).json({ data: createdCategory, message: `Successfully created `, success: true })
    } catch (error) {
        console.log("Error creating category ", error);
        res.status(500).json({ message: "Failed to create category!" })
    }
}
const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({})
        const totalItems = allCategories.length
        res.status(200).json({ message: `${totalItems} ${totalItems > 1 ? 'categories' : 'category'} retrieved!`, data: allCategories, success: true })
    } catch (error) {
        console.log("Error retrieving categories", error)
        res.status(500).json({ message: "Failed to retrieve category!" })
    }
}
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedCategory) res.status(400).json({ success: false, message: "Failed to update category!" })

        return res.status(200).json({ data: updatedCategory, success: true, message: "Successfully updated category!" })
    } catch (error) {
        console.log("Error updating category", error)
        res.status(500).json({ message: "Failed to update category!" })
    }
}
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const deletedCategory = await Category.findByIdAndDelete(id, { new: true })
        if (!deletedCategory) res.status(400).json({ success: false, message: "Failed to delete category!" })

        res.status(200).json({ data: deletedCategory, message: "Successfully deleted category!", success: true })
    } catch (error) {
        console.log("Error deleting category", error)
        res.status(500).json({ message: "Failed to delete category!" })
    }
}
const deleteCategoryByName = async (req, res) => {
    try {
        const { name } = req.params
        const deletedCategory = await Category.findOneAndDelete({ name }, { new: true })
        if (!deletedCategory) res.status(400).json({ message: "Failed to delete category!" })

        res.status(200).json({ deletedCategory, message: "Successfully deleted category!" })
    } catch (error) {
        console.log("Error deleting category", error)
        res.status(500).json({ message: "Failed to delete category!" })
    }
}
const updateCategoryByName = async (req, res) => {
    try {
        const { name } = req.params
        const updatedCategory = await Category.findOneAndUpdate({ name }, req.body, { new: true })
        if (!updatedCategory) res.status(400).json({ message: "Failed to update category!" })

        res.status(200).json({ updatedCategory, message: "Successfully updated category!" })
    } catch (error) {
        console.log("Error updating category", error)
        res.status(500).json({ message: "Failed to update category!" })
    }
}
module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    deleteCategoryByName,
    updateCategoryByName

}