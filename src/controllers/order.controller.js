// controllers/order.controller.js
const Order = require("../models/order.model");
const { getIO } = require("../utils/socket");



// ✅ Get all orders (admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ shopId: req.id })
        return res.status(200).json({ success: true, orders });
    } catch (err) {
        console.error("❌ getAllOrders error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ✅ Get orders for a specific user
const getUserOrders = async (req, res) => {
    try {

        const { userId } = req.params;
        console.log("uid", userId)
        const orders = await Order.find({ "user.userId": userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error("❌ getUserOrders error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getOrderByShopId = async (req, res) => {
    try {

        // console.log("shop id", req.id)
        const orders = await Order.find({ "items.shopId": req.id }).sort({ createdAt: -1 });
        // console.log(orders)
        return res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error("❌ getUserOrdersByShopsId error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const getAllOrdersSuperAdmin = async (req, res) => {
    try {
        const orders = await Order.find({})
        return res.status(200).json({ success: true, data: orders })
    } catch (error) {
        console.error("❌ getAllOrderserror:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// ✅ Update order status (e.g., admin confirm or user cancel)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        console.log("order status")

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Prevent redundant updates
        if (order.status === status) {
            return res.status(200).json({ success: true, message: "No changes made", order });
        }

        // Prevent canceling confirmed/completed orders (for user-side cancel)
        if (order.status !== "pending" && status === "canceled") {
            return res.status(400).json({
                success: false,
                message: "Only pending orders can be canceled",
            });
        }

        order.status = status;
        await order.save();

        // Broadcast real-time update to all connected clients
        const io = getIO();
        io.emit("order_status_update", order);

        return res.status(200).json({
            success: true,
            message: `Order ${status === "canceled" ? "canceled" : "updated"} successfully`,
            order,
        });
    } catch (err) {
        console.error("❌ updateOrderStatus error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getOrderByShopId,
    getAllOrders,
    getUserOrders,
    updateOrderStatus,
    getAllOrdersSuperAdmin
};