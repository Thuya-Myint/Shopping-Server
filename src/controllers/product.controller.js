const Product = require("../models/product.model")
const Size = require("../models/size.model")

const createProduct = async (req, res) => {
    try {
        const createdProduct = await Product.create(req.body)
        if (!createdProduct) res.status(400).json({ "message": "Failed to add product!" })
        const sizes = createdProduct.size
        let createdSizesArray = []
        for (const size of sizes) {
            console.log("size ", size)
            const foundSize = await Size.findOne({ sizeNo: size?.sizeNo?.toString() })
            // console.log("Found size ", foundSize)
            if (!foundSize) {
                const createdSize = await Size.create({ sizeNo: size.sizeNo, category: createdProduct.category })
                if (!createdSize) {
                    await Product.findByIdAndDelete(createdProduct._id)
                } else {
                    createdSizesArray = [...createdSizesArray, createdSize]
                }
            }
        }
        res.status(200).json({ message: "Successfully created Product!", "Created Product": createdProduct, "Create Sizes": createdSizesArray })
    } catch (error) {
        console.log("Error creating product", error)
        res.status(500).json({ message: "Failed to create product" })
    }
}
const batchCreateProduct = async (req, res) => {
    try {
        const createdProduct = await Product.insertMany(req.body)
        res.status(200).json({ message: "Successfully created Product!", createdProduct })
    } catch (error) {
        console.log("Error creating product", error)
        res.status(500).json({ message: "Failed to create product" })
    }
}
const getAllProducts = async (req, res) => {

    try {
        const allProducts = await Product.find({})
        const totalProduct = allProducts.length
        res.status(200).json({ message: `${totalProduct} ${totalProduct > 1 ? "products" : "product"} retrieved!`, allProducts })
    } catch (error) {
        console.log("Error retrieving product", error)
        res.status(500).json({ message: "Failed to retrieve product" })
    }
}
const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params
        const foundProducts = await Product.find({ category })
        console.log("found product by category ", foundProducts)
        const totalProduct = foundProducts.length
        res.status(200).json({ message: `${totalProduct} ${totalProduct > 1 ? "products" : "product"} retrieved!`, foundProducts })
    } catch (error) {
        console.log("Error retrieving product by category", error)
        res.status(500).json({ message: "Failed to retrieve product by category" })
    }
}
const getProductByDiscountPercent = async (req, res) => {
    try {
        const { discount } = req.params
        console.log("type of params ", typeof parseInt(discount))
        const foundProducts = await Product.find({ discount: parseInt(discount) })

        console.log("found product by discount ", foundProducts)
        const totalProduct = foundProducts.length
        res.status(200).json({ message: `${totalProduct} ${totalProduct > 1 ? "products" : "product"} retrieved!`, foundProducts })
    } catch (error) {
        console.log("Error retrieving product by discount", error)
        res.status(500).json({ message: "Failed to retrieve product by discount" })
    }
}
const getProductWithDiscount = async (req, res) => {
    try {
        const foundProducts = await Product.find({ discount: { $gt: 0 } })
        console.log("found product by discount ", foundProducts)
        const totalProduct = foundProducts.length
        res.status(200).json({ message: `${totalProduct} ${totalProduct > 1 ? "products" : "product"} retrieved!`, foundProducts })
    } catch (error) {
        console.log("Error retrieving product by discount", error)
        res.status(500).json({ message: "Failed to retrieve product by discount" })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductByCategory,
    getProductByDiscountPercent,
    batchCreateProduct,
    getProductWithDiscount
}