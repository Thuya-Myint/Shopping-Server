const Product = require("../models/product.model")
const Size = require("../models/size.model")

const { uploadImages } = require("../config/supabase")

const createProduct = async (req, res) => {
    try {

        let imageUrls = []

        if (req.files && req.files.length > 0) {
            imageUrls = await uploadImages(req.files)
        }

        req.body.images = imageUrls

        const createdProduct = await Product.create({
            ...req.body,
            imageUrls
        })
        if (!createdProduct)
            return res.status(400).json({ message: "Failed to add product!" })


        const sizes = createdProduct.size
        let createdSizesArray = []

        for (const size of sizes) {
            const foundSize = await Size.findOne({ sizeNo: size?.sizeNo?.toString() })

            if (!foundSize) {
                const createdSize = await Size.create({
                    sizeNo: size.sizeNo,
                    category: createdProduct.category
                })

                if (!createdSize) {
                    await Product.findByIdAndDelete(createdProduct._id)
                } else {
                    createdSizesArray.push(createdSize)
                }
            }
        }

        res.status(200).json({
            message: "Successfully created Product!",
            createdProduct,
            createdSizesArray
        })

    } catch (error) {
        console.log("Error creating product", error)
        res.status(500).json({ message: "Failed to create product" })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found!" });

        let imageUrls = product.imageUrls || [];

        // Upload new images if any
        if (req.files && req.files.length > 0) {
            const uploadedUrls = await uploadImages(req.files);
            imageUrls = [...uploadedUrls];
        }

        // Parse size and variants if they come as string
        let sizes = req.body.size;
        let variants = req.body.variants;

        if (typeof sizes === "string") sizes = JSON.parse(sizes);
        if (typeof variants === "string") variants = JSON.parse(variants);

        // Update product fields
        product.name = req.body.name || product.name;
        product.modelNo = req.body.modelNo || product.modelNo;
        product.category = req.body.category || product.category;
        product.gender = req.body.gender || product.gender;
        product.discount = req.body.discount ?? product.discount;
        product.size = sizes || product.size;
        product.variants = variants || product.variants;
        product.imageUrls = imageUrls;

        // Save updated product
        const updatedProduct = await product.save();

        // Ensure sizes exist in Size collection
        const createdSizesArray = [];
        for (const size of updatedProduct.size) {
            const foundSize = await Size.findOne({ sizeNo: size.price.toString() }); // using price as unique for your logic
            if (!foundSize) {
                const createdSize = await Size.create({
                    sizeNo: size.price,
                    category: updatedProduct.category
                });
                if (createdSize) createdSizesArray.push(createdSize);
            }
        }

        res.status(200).json({
            message: "Product updated successfully!",
            updatedProduct,
            createdSizesArray
        });

    } catch (error) {
        console.log("Error updating product", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};
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
        const allProducts = await Product.find({}).populate("size")
        const totalProduct = allProducts.length
        res.status(200).json({ message: `${totalProduct} ${totalProduct > 1 ? "products" : "product"} retrieved!`, data: allProducts })
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
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProduct = await Product.findByIdAndDelete(id, { new: true })
        if (!deletedProduct) res.status(400).json({ message: "Failed to delete product!", success: false, })
        res.status(200).json({ data: deletedProduct, message: "Successfully deleted product!", success: true })
    } catch (error) {
        console.log("Error deleting product ", error)
        res.status(500).json({ message: "Failed to delete product. Internal server error!" })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductByCategory,
    getProductByDiscountPercent,
    batchCreateProduct,
    getProductWithDiscount,
    updateProduct,
    deleteProduct
}