import { PricingStrategy, VehicleType } from "../types";

// Strategy Interface
interface IPricingStrategy {
    getMultiplier(): number;
    getName(): string;
}

// Base Rate per km by vehicle type
const BASE_RATES: Record<VehicleType, number> = {
    [VehicleType.ECONOMY]: 12,   // ₹12/km
    [VehicleType.PREMIUM]: 22,   // ₹22/km
    [VehicleType.BIKE]: 7,       // ₹7/km
    [VehicleType.AUTO]: 10,      // ₹10/km
};

const BASE_FARE: Record<VehicleType, number> = {
    [VehicleType.ECONOMY]: 50,
    [VehicleType.PREMIUM]: 100,
    [VehicleType.BIKE]: 25,
    [VehicleType.AUTO]: 30,
};

// Concrete Strategies
class BasePricingStrategy implements IPricingStrategy {
    getMultiplier() { return 1.0; }
    getName() { return "BASE"; }
}

class SurgePricingStrategy implements IPricingStrategy {
    getMultiplier() { return 1.8; }
    getName() { return "SURGE"; }
}

class NightPricingStrategy implements IPricingStrategy {
    getMultiplier() { return 1.3; }
    getName() { return "NIGHT"; }
}

// Strategy Factory
export function getPricingStrategy(strategy: PricingStrategy): IPricingStrategy {
    switch (strategy) {
        case PricingStrategy.SURGE: return new SurgePricingStrategy();
        case PricingStrategy.NIGHT: return new NightPricingStrategy();
        default: return new BasePricingStrategy();
    }
}

// Auto-detect strategy based on time
export function detectPricingStrategy(): PricingStrategy {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) return PricingStrategy.NIGHT;
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) return PricingStrategy.SURGE;
    return PricingStrategy.BASE;
}

// Calculate fare
export function calculateFare(
    vehicleType: VehicleType,
    distanceKm: number,
    strategy: PricingStrategy
): number {
    const pricingStrategy = getPricingStrategy(strategy);
    const baseFare = BASE_FARE[vehicleType];
    const ratePerKm = BASE_RATES[vehicleType];
    const multiplier = pricingStrategy.getMultiplier();

    const fare = (baseFare + ratePerKm * distanceKm) * multiplier;
    return Math.round(fare);
}