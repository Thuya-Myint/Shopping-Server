const express = require("express");
const router = express.Router();
const { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment, getPaymentsByShopId } = require("../controllers/payment.controller");
const { verifyToken } = require("../helper/authJwt");

// CRUD
router.get("/payments-by-id/:id", verifyToken, getPaymentsByShopId)
router.post("/", verifyToken, createPayment);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;