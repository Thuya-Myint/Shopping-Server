const express = require("express")
const router = express.Router();
const { createUnit, updateUnit, getAllUnit, deleteUnit } = require("../controllers/unit.controller")
const verifyToken = require("../helper/authJwt")
router.post("/", createUnit)
router.put("/:id", updateUnit)
router.get("/", getAllUnit)
router.delete("/:id", deleteUnit)

module.exports = router