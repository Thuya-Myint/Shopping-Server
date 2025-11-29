const jwt = require("jsonwebtoken")
const config = require("../config/config")

const createToken = (payload, rememberMe = false) => {
    if (rememberMe) {
        // No expiration
        return jwt.sign(payload, config.SECRET_KEY);
    }

    // Normal login → expire
    return jwt.sign(payload, config.SECRET_KEY, {
        expiresIn: config.JWT_TTL || "1d",
    });
};

const allowedRole = (...role) => {
    return (req, res, next) => {
        try {
            if (!role.includes(req.role.name)) return res.status(403).json({
                message: "do not have permission",
                success: false
            })
            next()
        } catch (error) {
            return res.status(403).json({
                message: "do not have permission",
                success: false
            })
        }
    }
}
module.exports = {
    createToken,
    allowedRole
}