const jwt = require("jsonwebtoken")
const config = require("../config/config")

const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) return res.status(401).json({ message: "No token provided!" })

    jwt.verify(token, config.SECRET_KEY, async (err, decoded) => {

        if (err) return res.status(403).json({ message: "user not authenticated!", error: err })

        // console.log("decoded ", decoded)
        req.name = decoded.name
        req.role = decoded.role

        next()
    })
}

module.exports = { verifyToken }