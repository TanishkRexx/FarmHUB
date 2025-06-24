const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const PORT = 8001; // Server port
const app = express();
const server = http.createServer(app); // HTTP server for Express & Socket.io

// Configure Socket.io
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"], // Allow frontend connections
        methods: ["GET", "POST"]
    }
});

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/PBL")
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.error("MongoDB Connection Failed:", error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
}));

// REST API Routes
const authRoutes = require("./router/authRoutes");
app.use("/api/auth", authRoutes);

// WebSocket Logic
const chatUsers = {};
const buyers = [];
const sellers = {};
const chatPairs = {}; // Track assigned chat pairs

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_chat", ({ username, role }) => {
        chatUsers[socket.id] = { username, role };
        console.log(`${username} (${role}) joined chat`);

        if (role === "buyer") {
            if (Object.keys(sellers).length > 0) {
                let sellerId = Object.keys(sellers)[0];
                chatPairs[socket.id] = sellerId;
                chatPairs[sellerId] = socket.id;

                io.to(socket.id).emit("assign_partner", chatUsers[sellerId].username);
                io.to(sellerId).emit("assign_partner", username);

                delete sellers[sellerId];
            } else {
                buyers.push(socket.id);
            }
        } else if (role === "seller") {
            sellers[socket.id] = { username };

            if (buyers.length > 0) {
                let buyerId = buyers.shift();
                chatPairs[socket.id] = buyerId;
                chatPairs[buyerId] = socket.id;

                io.to(socket.id).emit("assign_partner", chatUsers[buyerId].username);
                io.to(buyerId).emit("assign_partner", username);
            }
        }

        io.emit("update_users", Object.values(chatUsers));
    });

    socket.on("send_message", (data) => {
        console.log(`Message from ${data.sender}: ${data.message}`);
        const recipientSocket = chatPairs[socket.id];

        if (recipientSocket) {
            io.to(recipientSocket).emit("receive_message", data);
        }
    });

    socket.on("disconnect", () => {
        if (chatUsers[socket.id]) {
            console.log(`${chatUsers[socket.id].username} disconnected`);
            delete chatUsers[socket.id];

            if (buyers.includes(socket.id)) {
                buyers.splice(buyers.indexOf(socket.id), 1);
            }

            if (sellers[socket.id]) {
                delete sellers[socket.id];
            }

            if (chatPairs[socket.id]) {
                let partnerId = chatPairs[socket.id];
                io.to(partnerId).emit("partner_disconnected");

                delete chatPairs[partnerId];
                delete chatPairs[socket.id];
            }

            io.emit("update_users", Object.values(chatUsers));
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (REST + WebSocket)`);
});
