"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Concrete Observer: Notification Service (logs for now, plug in socket.io later)
class NotificationObserver {
    update(rideId, event, data) {
        console.log(`📱 [Notification] Ride ${rideId} - ${event}:`, data);
    }
}
// Concrete Observer: Analytics Service
class AnalyticsObserver {
    update(rideId, event, data) {
        console.log(`📊 [Analytics] Ride ${rideId} - ${event}:`, data);
    }
}
// Singleton RideManager
class RideManager {
    constructor() {
        this.activeRides = new Map();
        this.observers = [];
        // Register observers
        this.observers.push(new NotificationObserver());
        this.observers.push(new AnalyticsObserver());
        console.log("🚗 RideManager Singleton initialized");
    }
    static getInstance() {
        if (!RideManager.instance) {
            RideManager.instance = new RideManager();
        }
        return RideManager.instance;
    }
    // Notify all observers
    notify(rideId, event, data) {
        this.observers.forEach((obs) => obs.update(rideId, event, data));
    }
    addRide(ride) {
        this.activeRides.set(ride._id.toString(), ride);
        this.notify(ride._id.toString(), "RIDE_CREATED", { status: ride.status });
    }
    updateRide(ride, event) {
        this.activeRides.set(ride._id.toString(), ride);
        this.notify(ride._id.toString(), event, { status: ride.status });
    }
    removeRide(rideId) {
        this.activeRides.delete(rideId);
        this.notify(rideId, "RIDE_REMOVED", {});
    }
    getActiveRides() {
        return Array.from(this.activeRides.values());
    }
    getActiveRideCount() {
        return this.activeRides.size;
    }
}
exports.default = RideManager;
