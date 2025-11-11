const express = require("express")
const router = express.Router()
const { createProduct, getAllProducts, getProductByCategory, batchCreateProduct, getProductByDiscountPercent, getProductWithDiscount, updateProduct, deleteProduct } = require("../controllers/product.controller")
const { uploadMultiple } = require("../config/supabase")
const { verifyToken } = require("../helper/authJwt")

router.post("/", uploadMultiple, createProduct)
router.post("/batch/", batchCreateProduct)
router.get("/", verifyToken, getAllProducts)
router.get("/category/:category", getProductByCategory)
router.get("/discount/:discount", getProductByDiscountPercent)
router.get("/with-discount", getProductWithDiscount)
router.put("/:id", uploadMultiple, updateProduct)
router.delete("/:id", deleteProduct)


module.exports = router