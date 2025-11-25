// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./src/config/config");
const { connectRedis } = require("./src/config/redisClient");
const { initSocket } = require("./src/utils/socket");

// Routes
const userRoute = require("./src/routes/user.routes");
const unitRoute = require("./src/routes/unit.routes");
const categoryRoute = require("./src/routes/category.routes");
const productRoute = require("./src/routes/product.routes");
const sizeRoute = require("./src/routes/size.routes");
const roleRoute = require("./src/routes/role.routes");
const orderRoute = require("./src/routes/order.routes");
const paymentRoute = require("./src/routes/payment.routes")
const app = express();
const server = http.createServer(app); // ✅ IMPORTANT

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:7500"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

// Test route
app.get("/", (req, res) => {
    res.send("API is running with Socket.IO!");
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/unit", unitRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/size", sizeRoute);
app.use("/api/v1/role", roleRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute)

// ✅ Initialize Socket.IO
initSocket(server);

// ✅ Start server
server.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}`);
});

// ✅ Connect MongoDB
mongoose
    .connect(config.MONGO_URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("Mongo error:", err));

// ✅ Connect Redis
connectRedis()
    .then(() => console.log("Redis connected"))
    .catch((err) => console.error("Redis error:", err));