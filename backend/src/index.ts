import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";
import rideRoutes from "./routes/ride.routes";
import driverRoutes from "./routes/driver.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/driver", driverRoutes);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "RideLink API running 🚗" });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`🚀 RideLink server running on http://localhost:${PORT}`);
});

export default app;