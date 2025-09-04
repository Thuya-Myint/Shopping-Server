const express = require("express")
const router = express.Router()
const { createProduct, getAllProducts, getProductByCategory, batchCreateProduct, getProductByDiscountPercent, getProductWithDiscount } = require("../controllers/product.controller")


router.post("/", createProduct)
router.post("/batch/", batchCreateProduct)
router.get("/", getAllProducts)
router.get("/category/:category", getProductByCategory)
router.get("/discount/:discount", getProductByDiscountPercent)
router.get("/with-discount", getProductWithDiscount)



module.exports = router