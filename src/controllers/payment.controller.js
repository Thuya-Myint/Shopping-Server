// controllers/payment.controller.js
const Payment = require("../models/payment.model");

// -------------------------------------------
// ✅ Create Payment
// -------------------------------------------
const createPayment = async (req, res) => {
    try {
        const { name, number } = req.body;

        if (!name || !number) {
            return res.status(400).json({
                success: false,
                message: "Name and number are required",
            });
        }

        // Prevent duplicate numbers
        const exists = await Payment.findOne({ number });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Payment number already exists",
            });
        }

        const payment = await Payment.create({ name, number, shopId: req.id });

        return res.status(201).json({
            success: true,
            message: "Payment added successfully",
            data: payment,
        });
    } catch (err) {
        console.error("❌ createPayment error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getPaymentsByShopId = async (req, res) => {
    try {
        const { id } = req.params
        const payments = await Payment.find({ shopId: id })

        return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (err) {
        console.error("❌ getAllPayments error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// -------------------------------------------
// ✅ Get All Payments
// -------------------------------------------
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (err) {
        console.error("❌ getAllPayments error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// -------------------------------------------
// ✅ Get Payment by ID
// -------------------------------------------
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (err) {
        console.error("❌ getPaymentById error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// -------------------------------------------
// ✅ Update Payment
// -------------------------------------------
const updatePayment = async (req, res) => {
    try {
        const { name, number } = req.body;

        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        // Prevent number duplication
        if (number) {
            const exists = await Payment.findOne({ number, _id: { $ne: req.params.id } });
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Payment number already exists",
                });
            }
        }

        payment.name = name ?? payment.name;
        payment.number = number ?? payment.number;
        await payment.save();

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: payment,
        });
    } catch (err) {
        console.error("❌ updatePayment error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// -------------------------------------------
// ✅ Delete Payment
// -------------------------------------------
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
        });
    } catch (err) {
        console.error("❌ deletePayment error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// -------------------------------------------
module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    getPaymentById,
    getPaymentsByShopId

};