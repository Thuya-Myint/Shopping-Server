const jwt = require("jsonwebtoken")
const config = require("../config/config")

const createToken = (payload) => {
    return jwt.sign(payload, config.SECRET_KEY, {
        expiresIn: config.JWT_TTL
    })
}

module.exports = {
    createToken
}