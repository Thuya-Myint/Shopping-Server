const UnitModel = require("../models/unit.model")


const getAllUnit = async (req, res) => {
    try {
        const allUnits = await UnitModel.find({})
        res.status(200).json({ message: `Total ${allUnits.length} unit!`, allUnits })
    } catch (error) {
        console.log("error fetching unit ", error)
        res.status(500).json({ message: "Failed to fetch unit!" })
    }
}
const createUnit = async (req, res) => {
    try {
        const createdUnit = await UnitModel.create({ name: req.body.name.toUpperCase() })
        if (!createUnit) res.status(400).json({ message: "Failed to create unit!" })

        res.status(200).json({ createdUnit, message: "Successfully created unit!" })
    } catch (error) {
        console.log("error creating unit ", error)
        res.status(500).json({ message: "Failed to add unit!" })
    }
}
const updateUnit = async (req, res) => {
    try {
        const { id } = req.params
        console.log("unit id ", id)
        const updatedUnit = await UnitModel.findByIdAndUpdate(req.params.id, { name: req.body.name.toUpperCase() }, { new: true })
        if (!updatedUnit) res.status(400).json({ message: "Failed to update unit!" })

        res.status(200).json({ updatedUnit, message: "Successfully updated unit!" })
    } catch (error) {
        console.log("error updating unit ", error)
        res.status(500).json({ message: "Failed to update unit!" })
    }
}
const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params
        console.log("unit id ", id)
        const deletedUnit = await UnitModel.findByIdAndDelete(req.params.id, { new: true })
        if (!deletedUnit) res.status(400).json({ message: "Failed to delete unit!" })

        res.status(200).json({ deletedUnit, message: "Successfully deleted unit!" })
    } catch (error) {
        console.log("error deleting unit ", error)
        res.status(500).json({ message: "Failed to delete unit!" })
    }
}
module.exports = {
    createUnit,
    updateUnit,
    getAllUnit,
    deleteUnit
}