const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        number: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            requred: true,
            ref: "user"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);