const express = require("express")
const router = express.Router()
const { createCategory, getAllCategories, updateCategory, deleteCategory, deleteCategoryByName, updateCategoryByName, getCategoryByShopId } = require("../controllers/category.controller")
const { verifyToken } = require("../helper/authJwt")
const { upload } = require("../config/supabase")
// router.use(verifyToken)

router.post("/", verifyToken, createCategory)
router.get("/", verifyToken, getAllCategories)
router.put("/id/:id", updateCategory)
router.get("/categories-by-id", verifyToken, getCategoryByShopId)
router.put("/name/:name", updateCategoryByName)
router.delete("/name/:name", deleteCategoryByName)
router.delete("/id/:id", deleteCategory)


module.exports = router