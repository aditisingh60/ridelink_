"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const ride_routes_1 = __importDefault(require("./routes/ride.routes"));
const driver_routes_1 = __importDefault(require("./routes/driver.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Connect DB
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/rides", ride_routes_1.default);
app.use("/api/driver", driver_routes_1.default);
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
exports.default = app;
