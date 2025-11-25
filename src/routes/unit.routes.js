const express = require("express")
const router = express.Router();
const { createUnit, updateUnit, getAllUnit, deleteUnit, getUnitByShopId } = require("../controllers/unit.controller")
const { verifyToken } = require("../helper/authJwt")
router.post("/", verifyToken, createUnit)
router.put("/:id", updateUnit)
router.get("/", verifyToken, getAllUnit)
router.get("/units-by-id", verifyToken, getUnitByShopId)
router.delete("/:id", deleteUnit)

module.exports = router