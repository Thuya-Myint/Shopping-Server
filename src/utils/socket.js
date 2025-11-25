const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Order = require("../models/order.model");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST", "PATCH"] },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // --- JOIN ROOMS ---
        socket.on("join_shop", ({ shopId }) => {
            if (!shopId) return;
            const roomName = `shop_${String(shopId)}`;
            console.log(`Socket ${socket.id} joining room: ${roomName}`);
            socket.join(roomName);
        });

        socket.on("join_user", ({ userId }) => {
            console.log("uid", userId)
            const roomName = `user_${String(userId)}`
            console.log(`Socket ${socket.id} joining room: ${roomName}`);
            if (!userId) return;
            socket.join(roomName);
        });

        // --- NEW ORDER LOGIC ---
        socket.on("new_order", async (payload) => {
            try {
                console.log("order received ", payload)
                const { items, note = "", name, email = "", userId, paymentMethods } = payload || {};

                if (!name || !userId || !Array.isArray(items) || items.length === 0) {
                    return socket.emit("order_error", { message: "Invalid order payload.", success: false });
                }

                // Normalize items
                const normalizedItems = items.map((i) => ({
                    productId: String(i.productId ?? i._id ?? i.id),
                    name: i.name ?? "Unnamed product",
                    price: Number(i.price ?? 0),
                    qty: Number(i.qty ?? 1),
                    size: i.size ?? null,
                    variant: i.variant ?? null,
                    subtotal: (Number(i.price ?? 0)) * (Number(i.qty ?? 1)),
                    shopId: String(i.shopId ?? i.shop?.toString()),
                }));

                // Group by Shop ID
                const grouped = normalizedItems.reduce((acc, it) => {
                    if (!acc[it.shopId]) acc[it.shopId] = [];
                    acc[it.shopId].push(it);
                    return acc;
                }, {});

                const session = await mongoose.startSession();
                let createdOrders = [];

                try {
                    await session.withTransaction(async () => {
                        const orderDocs = Object.keys(grouped).map((shopId) => {
                            const shopItems = grouped[shopId];
                            const total = shopItems.reduce((s, it) => s + it.subtotal, 0);
                            return {
                                user: { name, email, userId },
                                items: shopItems,
                                total,
                                paymentMethods: paymentMethods ?? {},
                                note,
                                status: "pending",
                                shopId: String(shopId), // Ensure shopId is saved at root
                            };
                        });

                        createdOrders = await Order.insertMany(orderDocs, { session });
                    });
                } finally {
                    session.endSession();
                }

                socket.emit("order_success", { message: "Order placed", data: createdOrders, success: true });

                console.log("created order ", createdOrders)
                // Emit notifications
                createdOrders.forEach((ord) => {
                    // Emit to Shop Admin
                    const shopRoom = `shop_${String(ord.items[0].shopId)}`;
                    io.to(shopRoom).emit("order_created", ord);

                    // // Emit Global
                    // io.emit("order_created_global", ord);

                    // Emit to User
                    const uid = ord.user?.userId ?? ord.userId ?? (ord.user && ord.user._id) ?? null;
                    if (uid) io.to(`user_${String(uid)}`).emit("order_created_for_user", ord);
                });

            } catch (err) {
                console.error("new_order error:", err);
                socket.emit("order_error", { message: err?.message || "Failed to place order", success: false });
            }
        });

        // --- UPDATE STATUS HELPER ---
        const handleUpdateStatus = async (orderId, status, emitterSocket = socket) => {
            console.log(`Update status triggered: ${orderId} -> ${status}`);
            try {
                if (!orderId) return emitterSocket.emit("order_error", { message: "orderId required", success: false });

                const order = await Order.findById(orderId);
                if (!order) return emitterSocket.emit("order_error", { message: "Order not found", success: false });

                const prevStatus = order.status;
                order.status = status;
                await order.save();

                // 1. Determine Shop ID (Handle cases where shopId might not be at root)
                const rawShopId = order.shopId || (order.items && order.items.length > 0 ? order.items[0].shopId : null);

                if (rawShopId) {
                    const shopRoom = `shop_${String(rawShopId)}`;
                    console.log(`Emitting 'order_updated' to room: ${shopRoom}`);
                    io.to(shopRoom).emit("order_updated", order);
                } else {
                    console.warn("Could not determine shopId for order:", order._id);
                }

                // 2. Emit to User
                const uid = order.user?.userId;
                if (uid) io.to(`user_${String(uid)}`).emit("order_status_update", order);

                // 3. Global event
                io.emit("order_status_change_global", { orderId: order._id, oldStatus: prevStatus, newStatus: status });

                // 4. Acknowledge sender
                emitterSocket.emit("order_status_changed", { message: "Order status updated", data: order, success: true });

            } catch (err) {
                console.error("update status error:", err);
                emitterSocket.emit("order_error", { message: err?.message || "Failed to update order", success: false });
            }
        };

        // --- UPDATE LISTENERS ---
        socket.on("update_order_status", async ({ orderId, status }) => {
            await handleUpdateStatus(orderId, status, socket);
        });

        socket.on("cancel_order", async ({ orderId }) => {
            await handleUpdateStatus(orderId, "cancelled", socket);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket.IO not initialized");
    return io;
};

module.exports = { initSocket, getIO };