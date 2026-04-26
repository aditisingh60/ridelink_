// Enums
export enum RideStatus {
    REQUESTED = "REQUESTED",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum VehicleType {
    ECONOMY = "ECONOMY",
    PREMIUM = "PREMIUM",
    BIKE = "BIKE",
    AUTO = "AUTO",
}

export enum UserRole {
    RIDER = "RIDER",
    DRIVER = "DRIVER",
}

export enum PricingStrategy {
    BASE = "BASE",
    SURGE = "SURGE",
    NIGHT = "NIGHT",
}

// Interfaces
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone: string;
    createdAt: Date;
}

export interface IRider extends IUser {
    totalRides: number;
    rating: number;
}

export interface IDriver extends IUser {
    vehicleType: VehicleType;
    vehicleNumber: string;
    isAvailable: boolean;
    totalEarnings: number;
    rating: number;
    currentLocation?: { lat: number; lng: number };
}

export interface IRide {
    _id: string;
    rider: string;
    driver?: string;
    pickup: string;
    dropoff: string;
    vehicleType: VehicleType;
    status: RideStatus;
    pricingStrategy: PricingStrategy;
    fare: number;
    distance: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface JwtPayload {
    userId: string;
    role: UserRole;
}