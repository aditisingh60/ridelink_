"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverStats = exports.getDriverRides = exports.completeRide = exports.startRide = exports.acceptRide = void 0;
const Ride_model_1 = __importDefault(require("../models/Ride.model"));
const User_model_1 = require("../models/User.model");
const types_1 = require("../types");
const rideManager_service_1 = __importDefault(require("../services/rideManager.service"));
const rideManager = rideManager_service_1.default.getInstance();
// PATCH /api/driver/rides/:id/accept
const acceptRide = async (req, res) => {
    try {
        const ride = await Ride_model_1.default.findById(req.params.id);
        if (!ride) {
            res.status(404).json({ message: "Ride not found." });
            return;
        }
        if (ride.status !== types_1.RideStatus.REQUESTED) {
            res.status(400).json({ message: "Ride is no longer available." });
            return;
        }
        ride.driver = req.user?.userId;
        ride.status = types_1.RideStatus.ASSIGNED;
        await ride.save();
        // Mark driver as unavailable
        await User_model_1.Driver.findByIdAndUpdate(req.user?.userId, { isAvailable: false });
        rideManager.updateRide(ride, "RIDE_ASSIGNED");
        res.status(200).json({ message: "Ride accepted.", ride });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.acceptRide = acceptRide;
// PATCH /api/driver/rides/:id/start
const startRide = async (req, res) => {
    try {
        const ride = await Ride_model_1.default.findById(req.params.id);
        if (!ride || ride.driver?.toString() !== req.user?.userId) {
            res.status(403).json({ message: "Not authorized." });
            return;
        }
        if (ride.status !== types_1.RideStatus.ASSIGNED) {
            res.status(400).json({ message: "Ride must be ASSIGNED to start." });
            return;
        }
        ride.status = types_1.RideStatus.IN_PROGRESS;
        await ride.save();
        rideManager.updateRide(ride, "RIDE_STARTED");
        res.status(200).json({ message: "Ride started.", ride });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.startRide = startRide;
// PATCH /api/driver/rides/:id/complete
const completeRide = async (req, res) => {
    try {
        const ride = await Ride_model_1.default.findById(req.params.id);
        if (!ride || ride.driver?.toString() !== req.user?.userId) {
            res.status(403).json({ message: "Not authorized." });
            return;
        }
        if (ride.status !== types_1.RideStatus.IN_PROGRESS) {
            res.status(400).json({ message: "Ride must be IN_PROGRESS to complete." });
            return;
        }
        ride.status = types_1.RideStatus.COMPLETED;
        await ride.save();
        // Update driver earnings and make available
        await User_model_1.Driver.findByIdAndUpdate(req.user?.userId, {
            $inc: { totalEarnings: ride.fare },
            isAvailable: true,
        });
        rideManager.updateRide(ride, "RIDE_COMPLETED");
        rideManager.removeRide(ride._id.toString());
        res.status(200).json({ message: "Ride completed.", ride });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.completeRide = completeRide;
// GET /api/driver/rides/my  — Driver's ride history
const getDriverRides = async (req, res) => {
    try {
        const rides = await Ride_model_1.default.find({ driver: req.user?.userId })
            .populate("rider", "name phone rating")
            .sort({ createdAt: -1 });
        res.status(200).json({ rides });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.getDriverRides = getDriverRides;
// GET /api/driver/stats
const getDriverStats = async (req, res) => {
    try {
        const driver = await User_model_1.Driver.findById(req.user?.userId).select("-password");
        const totalCompleted = await Ride_model_1.default.countDocuments({
            driver: req.user?.userId,
            status: types_1.RideStatus.COMPLETED,
        });
        res.status(200).json({ driver, totalCompleted });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.getDriverStats = getDriverStats;
