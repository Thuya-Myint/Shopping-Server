const UserModel = require("../models/user.model")
const { encryption, comparison, decryption } = require("../helper/encryptDecrypt")
const { createToken } = require("../helper/common.helper")
const { uploadImage } = require("../config/supabase")

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
            console.log("user not exists")
            return res.status(404).json({ message: "user not exists!" })
        }

        console.log("found user ", foundUser)

        if (!comparison(passwordFromReq, foundUser.password)) {
            const decrypted = decryption(foundUser.password)
            console.log(foundUser.password)
            console.log("not authenticated!", passwordFromReq, decrypted)
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