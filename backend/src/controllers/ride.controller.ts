import { Request, Response } from "express";
import Ride from "../models/Ride.model";
import { UserRole, RideStatus, PricingStrategy } from "../types";
import {
    calculateFare,
    detectPricingStrategy,
} from "../services/pricing.service";
import RideManager from "../services/rideManager.service";

const rideManager = RideManager.getInstance();

// POST /api/rides/book  — Rider only
export const bookRide = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pickup, dropoff, vehicleType, distance } = req.body;
        const riderId = req.user?.userId;

        const strategy = detectPricingStrategy();
        const fare = calculateFare(vehicleType, distance, strategy);

        const ride = await Ride.create({
            rider: riderId,
            pickup,
            dropoff,
            vehicleType,
            status: RideStatus.REQUESTED,
            pricingStrategy: strategy,
            fare,
            distance,
        });

        // Register in Singleton RideManager — Observer fires here
        rideManager.addRide(ride);

        res.status(201).json({ message: "Ride booked successfully", ride });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error booking ride." });
    }
};

// GET /api/rides/my  — Rider's ride history
export const getMyRides = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const rides = await Ride.find({ rider: req.user?.userId })
            .populate("driver", "name phone vehicleType vehicleNumber rating")
            .sort({ createdAt: -1 });

        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// GET /api/rides/available  — Driver sees all REQUESTED rides
export const getAvailableRides = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const rides = await Ride.find({ status: RideStatus.REQUESTED })
            .populate("rider", "name phone rating")
            .sort({ createdAt: 1 });

        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// PATCH /api/rides/:id/cancel — Rider cancels
export const cancelRide = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            res.status(404).json({ message: "Ride not found." });
            return;
        }
        if (ride.rider.toString() !== req.user?.userId) {
            res.status(403).json({ message: "Not authorized." });
            return;
        }
        if (
            ride.status === RideStatus.IN_PROGRESS ||
            ride.status === RideStatus.COMPLETED
        ) {
            res
                .status(400)
                .json({ message: "Cannot cancel a ride in progress or completed." });
            return;
        }

        ride.status = RideStatus.CANCELLED;
        await ride.save();
        rideManager.updateRide(ride, "RIDE_CANCELLED");
        rideManager.removeRide(ride._id.toString());

        res.status(200).json({ message: "Ride cancelled.", ride });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// GET /api/rides/fare-estimate — Fare preview before booking
export const getFareEstimate = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { vehicleType, distance } = req.query;
        const strategy = detectPricingStrategy();
        const fare = calculateFare(
            vehicleType as any,
            parseFloat(distance as string),
            strategy
        );

        res.status(200).json({ fare, strategy, vehicleType, distance });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};