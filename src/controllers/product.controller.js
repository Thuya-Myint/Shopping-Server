const Product = require("../models/product.model")
const Size = require("../models/size.model")

const { uploadImages } = require("../config/supabase")

const createProduct = async (req, res) => {
    try {
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = await uploadImages(req.files);
        }

        console.log("req id ", req.id)
        const productData = {
            ...req.body,
            shopId: req.id,
            imageUrls,
            // Ensure JSON arrays are parsed as objects
            size: typeof req.body.size === "string" ? JSON.parse(req.body.size) : req.body.size || [],
            variants: typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants || [],
            discount: Number(req.body.discount) || 0
        };

        const createdProduct = await Product.create(productData);

        return res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: createdProduct
        });
    } catch (error) {
        console.log("Create product error:", error);
        return res.status(500).json({ success: false, message: "Failed to create product" });
    }
};

const updateProduct = async (req, res) => {
    try {
        let imageUrls = req.body.imageUrls || [];

        if (req.files && req.files.length > 0) {
            const uploaded = await uploadImages(req.files);
            imageUrls = [...imageUrls, ...uploaded];
        }

        const updatedData = {
            ...req.body,
            imageUrls,
            size: typeof req.body.size === "string" ? JSON.parse(req.body.size) : req.body.size || [],
            variants: typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants || [],
            discount: Number(req.body.discount) || 0
        };

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.log("Update product error:", error);
        return res.status(500).json({ success: false, message: "Failed to update product" });
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

const getProductsByShopId = async (req, res) => {
    try {
        let { page = 1, limit = 12, category, discount } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};

        // user/shop scope

        filter.shopId = req.id;  // or filter.shopId = id; (depending on your schema)

        // filter by category
        if (category) {
            filter.category = category;
        }

        // filter for discount items
        if (discount === "true") {
            filter.discount = { $gt: 0 };
        }

        // get total count
        const totalProducts = await Product.countDocuments(filter);

        // fetch paginated data
        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: `${products.length} product(s) retrieved`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            limit,
            data: products,
        });

    } catch (error) {
        console.error("Error retrieving product:", error);
        return res.status(500).json({ message: "Failed to retrieve product" });
    }
};

const getAllProducts = async (req, res) => {
    try {
        let { page = 1, limit = 12, category, discount } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};

        // ✅ Filter by category (existing feature)
        if (category) {
            filter.category = category;
        }

        // ✅ Filter by discount items only (new feature)
        // If discount=true → return items with discount > 0
        if (discount === "true") {
            filter.discount = { $gt: 0 };
        }

        // ✅ Total count for pagination
        const totalProducts = await Product.countDocuments(filter);

        // ✅ Paginated fetch
        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: `${products.length} product(s) retrieved`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            limit,
            data: products,
        });

    } catch (error) {
        console.log("Error retrieving product", error);
        return res.status(500).json({ message: "Failed to retrieve product" });
    }
};
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
    deleteProduct,
    getProductsByShopId
}