"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricingStrategy = getPricingStrategy;
exports.detectPricingStrategy = detectPricingStrategy;
exports.calculateFare = calculateFare;
const types_1 = require("../types");
// Base Rate per km by vehicle type
const BASE_RATES = {
    [types_1.VehicleType.ECONOMY]: 12, // ₹12/km
    [types_1.VehicleType.PREMIUM]: 22, // ₹22/km
    [types_1.VehicleType.BIKE]: 7, // ₹7/km
    [types_1.VehicleType.AUTO]: 10, // ₹10/km
};
const BASE_FARE = {
    [types_1.VehicleType.ECONOMY]: 50,
    [types_1.VehicleType.PREMIUM]: 100,
    [types_1.VehicleType.BIKE]: 25,
    [types_1.VehicleType.AUTO]: 30,
};
// Concrete Strategies
class BasePricingStrategy {
    getMultiplier() { return 1.0; }
    getName() { return "BASE"; }
}
class SurgePricingStrategy {
    getMultiplier() { return 1.8; }
    getName() { return "SURGE"; }
}
class NightPricingStrategy {
    getMultiplier() { return 1.3; }
    getName() { return "NIGHT"; }
}
// Strategy Factory
function getPricingStrategy(strategy) {
    switch (strategy) {
        case types_1.PricingStrategy.SURGE: return new SurgePricingStrategy();
        case types_1.PricingStrategy.NIGHT: return new NightPricingStrategy();
        default: return new BasePricingStrategy();
    }
}
// Auto-detect strategy based on time
function detectPricingStrategy() {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5)
        return types_1.PricingStrategy.NIGHT;
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20))
        return types_1.PricingStrategy.SURGE;
    return types_1.PricingStrategy.BASE;
}
// Calculate fare
function calculateFare(vehicleType, distanceKm, strategy) {
    const pricingStrategy = getPricingStrategy(strategy);
    const baseFare = BASE_FARE[vehicleType];
    const ratePerKm = BASE_RATES[vehicleType];
    const multiplier = pricingStrategy.getMultiplier();
    const fare = (baseFare + ratePerKm * distanceKm) * multiplier;
    return Math.round(fare);
}
