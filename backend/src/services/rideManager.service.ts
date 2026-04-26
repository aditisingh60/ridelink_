import { IRideDocument } from "../models/Ride.model";

// Observer Interface
interface IRideObserver {
    update(rideId: string, event: string, data: unknown): void;
}

// Concrete Observer: Notification Service (logs for now, plug in socket.io later)
class NotificationObserver implements IRideObserver {
    update(rideId: string, event: string, data: unknown): void {
        console.log(`📱 [Notification] Ride ${rideId} - ${event}:`, data);
    }
}

// Concrete Observer: Analytics Service
class AnalyticsObserver implements IRideObserver {
    update(rideId: string, event: string, data: unknown): void {
        console.log(`📊 [Analytics] Ride ${rideId} - ${event}:`, data);
    }
}

// Singleton RideManager
class RideManager {
    private static instance: RideManager;
    private activeRides: Map<string, IRideDocument> = new Map();
    private observers: IRideObserver[] = [];

    private constructor() {
        // Register observers
        this.observers.push(new NotificationObserver());
        this.observers.push(new AnalyticsObserver());
        console.log("🚗 RideManager Singleton initialized");
    }

    static getInstance(): RideManager {
        if (!RideManager.instance) {
            RideManager.instance = new RideManager();
        }
        return RideManager.instance;
    }

    // Notify all observers
    private notify(rideId: string, event: string, data: unknown): void {
        this.observers.forEach((obs) => obs.update(rideId, event, data));
    }

    addRide(ride: IRideDocument): void {
        this.activeRides.set(ride._id.toString(), ride);
        this.notify(ride._id.toString(), "RIDE_CREATED", { status: ride.status });
    }

    updateRide(ride: IRideDocument, event: string): void {
        this.activeRides.set(ride._id.toString(), ride);
        this.notify(ride._id.toString(), event, { status: ride.status });
    }

    removeRide(rideId: string): void {
        this.activeRides.delete(rideId);
        this.notify(rideId, "RIDE_REMOVED", {});
    }

    getActiveRides(): IRideDocument[] {
        return Array.from(this.activeRides.values());
    }

    getActiveRideCount(): number {
        return this.activeRides.size;
    }
}

export default RideManager;