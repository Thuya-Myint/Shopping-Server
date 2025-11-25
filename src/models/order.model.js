// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, default: null },
    variant: { type: String, default: null },
    qty: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            name: { type: String, required: true },
            email: { type: String, required: false },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
        },
        items: [orderItemSchema],
        total: { type: Number, required: true },
        paymentMethods: {
            type: Object,
            required: true
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "processed", "shipped", "delivered", "cancelled", "confirmed", "rejected", "completed"],
        },

        note: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);