//  import dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";
// import app from "./app";

// if (process.env.NODE_ENV !== "test") {
//   console.log("🚀 Connecting to MongoDB Atlas...");
//   mongoose
//     .connect(process.env.MONGO_URI!)
//     .then(() => console.log("✅ MongoDB connected"))
//     .catch((err) => console.error("❌ MongoDB connection failed:", err));
// } else {
//   console.log("🧪 Skipping MongoDB connection for test environment");
// }
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// server.ts// server.ts
import dotenv from "dotenv";
dotenv.config();

// import http from "http";
// import { Server } from "socket.io";
import app from "./app";
import { connectDB } from "./config/db";

//  Connect MongoDB
connectDB();

//  Create HTTP server from Express app
// const server = http.createServer(app);

//  Initialize Socket.IO and link with Express app
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:4200", // Angular frontend
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });

// Attach io instance to the app (so controllers can access it via req.io)
// (app as any).io = io;

//  Socket event handlers
// io.on("connection", (socket) => {
//   console.log(" Client connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log(" Client disconnected:", socket.id);
//   });
// });

//  Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
