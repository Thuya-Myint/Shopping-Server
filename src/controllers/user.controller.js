const UserModel = require("../models/user.model")
const { encryption, comparison, decryption } = require("../helper/encryptDecrypt")
const { createToken } = require("../helper/common.helper")
const { uploadImage } = require("../config/supabase")


const getAllAdmin = async (req, res) => {
    try {
        const allAdmin = await UserModel.find().populate({
            path: "role",
            match: { name: { $ne: "user" } }
        })
        const filtered = allAdmin.filter(u => u.role !== null);
        return res.status(200).json({ data: filtered, message: "Admin User Successfully fetched!", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error!", error })
    }
}
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const deletedUser = await UserModel.findByIdAndDelete(id)
        if (!deletedUser) res.status(400).json({ message: "Failed to delete User!", success: false })
        res.status(200).json({ message: "User successfully deleted!", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error!")
    }
}

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params
        const updatedUser = await UserModel.findByIdAndUpdate(id, { role: req.body.role }, { new: true }).populate("role")
        if (!updateUser) return res.status(400).json({ message: "Failed to update user role!", success: false })
        res.status(200).json({ success: true, message: "Successfully updated user!", data: updatedUser })
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error!")
    }
}
const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        let finalData = { ...req.body }
        console.log("req body ", req.body)

        //file
        if (req.file && req.body.image !== "null") {
            const imageUrl = await uploadImage(req.file)
            finalData = { ...finalData, imageUrl }
        } else {
            delete finalData.image
        }
        //password
        if (req.body.password && req.body.password !== "undefined") {
            console.log("password exists")
            finalData.password = encryption(req.body.password)
        } else {
            delete finalData.password
        }
        console.log("final data", finalData)
        const updatedUser = await UserModel.findByIdAndUpdate(id, finalData, { new: true })
        if (!updatedUser) res.status(400).json({ message: "Failed to update user!", success: false })
        res.status(200).json({
            message: "Successfully updated!",
            success: true,
            data: updatedUser

        })

    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error!")
    }
}

const registerUser = async (req, res) => {
    try {
        // console.log("req.body", req.body)

        const { rememberMe } = req.body
        const foundUser = await UserModel.find({ name: req.body.name })

        // console.log("found user ", foundUser)
        if (foundUser && foundUser.length > 0) {
            return res.status(400).json({ message: "User already exists!" })
        }

        const response = await UserModel.create({
            ...req.body,
            password: encryption(req.body.password)
        })

        const { name, password, role, _id } = response
        const token = createToken({ _id, name, password, role }, rememberMe)

        console.log("response", response)
        res.status(200).json({
            data: response,
            token,
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

        console.log("req login", req.body)
        const { name, email, rememberMe } = req.body
        const passwordFromReq = req.body.password//plain password

        const foundUser = await UserModel.findOne({ name: name }).populate("role")
        if (!foundUser) {
            // console.log("user not exists")/
            return res.status(404).json({ message: "user not exists!" })
        }

        // console.log("found user ", foundUser)

        if (!comparison(passwordFromReq, foundUser.password)) {


            return res.status(403).json({ message: "User not authorized!" })
        }
        // if (foundUser.isLoggedIn)
        //     return res.status(400).json({ message: "Login eleswhere!" })

        // const updatedUser = await UserModel.findOneAndUpdate({ name: name }, { isLoggedIn: true }, { new: true })
        return res.status(200).json({
            data: foundUser,
            token: createToken({
                _id: foundUser._id,
                name: foundUser.name,
                password: foundUser.password,
                role: foundUser.role
            }, rememberMe),
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
    deleteUser,
    getAllAdmin,
    updateUserRole
}