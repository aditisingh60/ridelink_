"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFareEstimate = exports.cancelRide = exports.getAvailableRides = exports.getMyRides = exports.bookRide = void 0;
const Ride_model_1 = __importDefault(require("../models/Ride.model"));
const types_1 = require("../types");
const pricing_service_1 = require("../services/pricing.service");
const rideManager_service_1 = __importDefault(require("../services/rideManager.service"));
const rideManager = rideManager_service_1.default.getInstance();
// POST /api/rides/book  — Rider only
const bookRide = async (req, res) => {
    try {
        const { pickup, dropoff, vehicleType, distance } = req.body;
        const riderId = req.user?.userId;
        const strategy = (0, pricing_service_1.detectPricingStrategy)();
        const fare = (0, pricing_service_1.calculateFare)(vehicleType, distance, strategy);
        const ride = await Ride_model_1.default.create({
            rider: riderId,
            pickup,
            dropoff,
            vehicleType,
            status: types_1.RideStatus.REQUESTED,
            pricingStrategy: strategy,
            fare,
            distance,
        });
        // Register in Singleton RideManager — Observer fires here
        rideManager.addRide(ride);
        res.status(201).json({ message: "Ride booked successfully", ride });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error booking ride." });
    }
};
exports.bookRide = bookRide;
// GET /api/rides/my  — Rider's ride history
const getMyRides = async (req, res) => {
    try {
        const rides = await Ride_model_1.default.find({ rider: req.user?.userId })
            .populate("driver", "name phone vehicleType vehicleNumber rating")
            .sort({ createdAt: -1 });
        res.status(200).json({ rides });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.getMyRides = getMyRides;
// GET /api/rides/available  — Driver sees all REQUESTED rides
const getAvailableRides = async (req, res) => {
    try {
        const rides = await Ride_model_1.default.find({ status: types_1.RideStatus.REQUESTED })
            .populate("rider", "name phone rating")
            .sort({ createdAt: 1 });
        res.status(200).json({ rides });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.getAvailableRides = getAvailableRides;
// PATCH /api/rides/:id/cancel — Rider cancels
const cancelRide = async (req, res) => {
    try {
        const ride = await Ride_model_1.default.findById(req.params.id);
        if (!ride) {
            res.status(404).json({ message: "Ride not found." });
            return;
        }
        if (ride.rider.toString() !== req.user?.userId) {
            res.status(403).json({ message: "Not authorized." });
            return;
        }
        if (ride.status === types_1.RideStatus.IN_PROGRESS ||
            ride.status === types_1.RideStatus.COMPLETED) {
            res
                .status(400)
                .json({ message: "Cannot cancel a ride in progress or completed." });
            return;
        }
        ride.status = types_1.RideStatus.CANCELLED;
        await ride.save();
        rideManager.updateRide(ride, "RIDE_CANCELLED");
        rideManager.removeRide(ride._id.toString());
        res.status(200).json({ message: "Ride cancelled.", ride });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.cancelRide = cancelRide;
// GET /api/rides/fare-estimate — Fare preview before booking
const getFareEstimate = async (req, res) => {
    try {
        const { vehicleType, distance } = req.query;
        const strategy = (0, pricing_service_1.detectPricingStrategy)();
        const fare = (0, pricing_service_1.calculateFare)(vehicleType, parseFloat(distance), strategy);
        res.status(200).json({ fare, strategy, vehicleType, distance });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.getFareEstimate = getFareEstimate;
