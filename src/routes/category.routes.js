const express = require("express")
const router = express.Router()
const { createCategory, getAllCategories, updateCategory, deleteCategory, deleteCategoryByName, updateCategoryByName } = require("../controllers/category.controller")
const { verifyToken } = require("../helper/authJwt")

// router.use(verifyToken)

router.post("/", verifyToken, createCategory)
router.get("/", verifyToken, getAllCategories)
router.put("/id/:id", updateCategory)

router.put("/name/:name", updateCategoryByName)
router.delete("/name/:name", deleteCategoryByName)
router.delete("/id/:id", deleteCategory)


module.exports = router