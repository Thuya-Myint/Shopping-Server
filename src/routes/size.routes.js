const express = require("express")
const router = express.Router()
const { verifyToken } = require("../helper/authJwt")
const { createSize } = require("../controllers/sizes.controller")

// router.use(verifyToken)

router.post("/", createSize)

module.exports = router
