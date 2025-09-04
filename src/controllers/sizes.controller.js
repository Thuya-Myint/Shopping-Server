const Size = require("../models/size.model")

const createSize = async (req, res) => {
    try {
        const createdSize = await Size.create(req.body)
        res.status(200).json({ 'message': 'Size created Successfully!', createdSize })
    } catch (error) {
        console.log("error creating size ", error)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}
module.exports = {
    createSize
}