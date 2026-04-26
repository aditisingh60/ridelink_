"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRide = createRide;
exports.getRideById = getRideById;
const Ride_model_1 = __importDefault(require("../models/Ride.model"));
const types_1 = require("../types");
const pricing_service_1 = require("./pricing.service");
const rideManager_service_1 = __importDefault(require("./rideManager.service"));
const rideManager = rideManager_service_1.default.getInstance();
/**
 * Factory: Creates a ride document with fare calculated by pricing strategy.
 */
async function createRide(params) {
    const { riderId, pickup, dropoff, vehicleType, distanceKm } = params;
    const strategy = (0, pricing_service_1.detectPricingStrategy)();
    const fare = (0, pricing_service_1.calculateFare)(vehicleType, distanceKm, strategy);
    const ride = await Ride_model_1.default.create({
        rider: riderId,
        pickup,
        dropoff,
        vehicleType,
        status: types_1.RideStatus.REQUESTED,
        pricingStrategy: strategy,
        fare,
        distance: distanceKm,
    });
    // Register in singleton & notify observers
    rideManager.addRide(ride);
    return ride;
}
async function getRideById(id) {
    return Ride_model_1.default.findById(id).populate('rider', 'name phone').populate('driver', 'name phone');
}
