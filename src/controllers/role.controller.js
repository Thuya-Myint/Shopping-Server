const Role = require("../models/role.model")

const createRole = async (req, res) => {
    try {
        const createdRole = await Role.create(req.body)
        res.status(200).json({ 'message': 'Role created Successfully!', data: createdRole, success: true })
    } catch (error) {
        console.log("error creating role ", error)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}
const getAllRole = async (req, res) => {
    try {
        const fetchedRole = await Role.find({})
        res.status(200).json({ 'message': 'Role fetched Successfully!', data: fetchedRole, success: true })
    } catch (error) {
        console.log("error fetching role ", error)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}
const updateRole = async (req, res) => {

    try {
        const { id } = req.params
        const updatedRole = await Role.findByIdAndUpdate(id, req.body)
        return res.status(200).json({ 'message': 'Role updated Successfully!', data: updatedRole, success: true })
    } catch (error) {
        console.log("error updating role ", error)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}


module.exports = {
    createRole,
    getAllRole,
    updateRole
}