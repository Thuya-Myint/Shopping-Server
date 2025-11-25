// routes/order.routes.js
const express = require("express");
const router = express.Router();
const {

    getAllOrders,
    getUserOrders,
    updateOrderStatus,
    getOrderByShopId,
    getAllOrdersSuperAdmin,
} = require("../controllers/order.controller");
const { verifyToken } = require("../helper/authJwt");
const { allowedRole } = require("../helper/common.helper");


router.get("/orders-by-id", verifyToken, getOrderByShopId)

// ✅ Admin: Get all orders
router.get("/", verifyToken, getAllOrders);
router.get("/super-admin", verifyToken, allowedRole("super-admin"), getAllOrdersSuperAdmin);

// ✅ User: Get own orders
router.get("/user/:userId", verifyToken, getUserOrders);

// ✅ Admin or user: Update status (e.g. cancel / confirm)
router.patch("/status", verifyToken, updateOrderStatus);


module.exports = router;