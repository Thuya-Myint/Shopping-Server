const UnitModel = require("../models/unit.model")
const { setCache, getCache, clearCache } = require("../config/redisClient")
const config = require("../config/config")

const getAllUnit = async (req, res) => {
    try {
        //redis 
        const cachedData = await getCache(config.REDIS_UNIT_KEY)
        if (cachedData) {
            const jsonData = JSON.parse(cachedData)
            return res.status(200).json({
                success: true,
                message: "Data fetch from Redis cache",
                data: jsonData
            })
        }

        const allUnits = await UnitModel.find({})
        // await clearCache(config.REDIS_UNIT_KEY)
        await setCache(config.REDIS_UNIT_KEY, allUnits)
        return res.status(200).json({
            success: true,
            message: "Data fetch from mongo",
            data: allUnits
        })
    } catch (error) {
        console.log("error fetching unit ", error)
        res.status(500).json({ message: "Failed to fetch unit!" })
    }
}
const createUnit = async (req, res) => {
    try {
        const createdUnit = await UnitModel.create({ name: req.body.name.toUpperCase() })
        if (!createUnit) res.status(405).json({ message: "Failed to create unit!", success: false })

        await clearCache(config.REDIS_UNIT_KEY)
        res.status(200).json({ data: createdUnit, message: "Successfully created unit!", success: true })
    } catch (error) {
        console.log("error creating unit ", error)
        res.status(500).json({ message: "Failed to add unit!", error: error })
    }
}
const updateUnit = async (req, res) => {
    try {
        const { id } = req.params
        console.log("unit id ", id)
        const updatedUnit = await UnitModel.findByIdAndUpdate(req.params.id, { name: req.body.name.toUpperCase() }, { new: true })
        if (!updatedUnit) res.status(400).json({ success: false, message: "Failed to update unit!" })
        await clearCache(config.REDIS_UNIT_KEY)
        res.status(200).json({ data: updatedUnit, message: "Successfully updated unit!", success: true })
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
        if (!deletedUnit) res.status(400).json({ message: "Failed to delete unit!", success: false })
        await clearCache(config.REDIS_UNIT_KEY)
        res.status(200).json({ data: deletedUnit, message: "Successfully deleted unit!", success: true })
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