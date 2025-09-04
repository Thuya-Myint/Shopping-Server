const UserModel = require("../models/user.model")
const { encryption, comparison } = require("../helper/encryptDecrypt")
const { createToken } = require("../helper/common.helper")

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const deletedUser = await UserModel.findByIdAndDelete(id)
        if (!deletedUser) res.status(400).json({ message: "Failed to delete User!" })
        res.status(200).json({ message: "User successfully deleted!" })
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error!")
    }
}
const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedUser) res.status(400).json({ message: "Failed to update User!" })
        res.status(200).json({ message: "Successfully Updated!" })
        console.log("updated user ", updatedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error!")
    }
}

const registerUser = async (req, res) => {
    try {
        console.log("req.body", req.body)

        const foundUser = await UserModel.find({ name: req.body.name })
        console.log("found user ", foundUser)
        if (foundUser && foundUser.length > 0) {
            return res.status(400).json({ message: "User already exists!" })
        }

        const response = await UserModel.create({
            ...req.body,
            password: encryption(req.body.password)
        })

        const { name, password, role } = response
        const token = createToken({ name, password, role })

        res.status(200).json({
            data: response,
            token: createToken({
                name: response.name,
                password: response.password,
                role: response.role
            }),
            success: true,
            message: "register success!"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error!")
    }
}


const loginUser = async (req, res) => {
    try {

        const { name, email } = req.body
        const passwordFromReq = req.body.password//plain password

        const foundUser = await UserModel.findOne({ name: name })
        if (!foundUser) {
            return res.status(404).json({ message: "user not exists!" })
        }

        if (!comparison(passwordFromReq, foundUser.password)) {
            console.log("not authenticated!")
            return res.status(403).json({ message: "User not authorized!" })
        }
        // if (foundUser.isLoggedIn)
        //     return res.status(400).json({ message: "Login eleswhere!" })

        // const updatedUser = await UserModel.findOneAndUpdate({ name: name }, { isLoggedIn: true }, { new: true })
        return res.status(200).json({
            data: foundUser,
            token: createToken({
                name: foundUser.name,
                password: foundUser.password,
                role: foundUser.role
            }),
            success: true,
            message: "login success!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error!")
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser
}