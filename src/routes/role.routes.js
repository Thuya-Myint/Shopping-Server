const express = require("express")
const router = express.Router()
const { verifyToken } = require("../helper/authJwt")
const { getAllRole, createRole, updateRole } = require("../controllers/role.controller")
const { allowedRole } = require("../helper/common.helper")

router.post("/", verifyToken, createRole)
router.get("/", verifyToken, getAllRole)
router.put("/:id", verifyToken, updateRole)

module.exports = router