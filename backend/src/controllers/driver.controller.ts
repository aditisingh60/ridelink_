import { Request, Response } from "express";
import Ride from "../models/Ride.model";
import { Driver } from "../models/User.model";
import { RideStatus } from "../types";
import RideManager from "../services/rideManager.service";

const rideManager = RideManager.getInstance();

// PATCH /api/driver/rides/:id/accept
export const acceptRide = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            res.status(404).json({ message: "Ride not found." });
            return;
        }
        if (ride.status !== RideStatus.REQUESTED) {
            res.status(400).json({ message: "Ride is no longer available." });
            return;
        }

        ride.driver = req.user?.userId as any;
        ride.status = RideStatus.ASSIGNED;
        await ride.save();

        // Mark driver as unavailable
        await Driver.findByIdAndUpdate(req.user?.userId, { isAvailable: false });

        rideManager.updateRide(ride, "RIDE_ASSIGNED");

        res.status(200).json({ message: "Ride accepted.", ride });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// PATCH /api/driver/rides/:id/start
export const startRide = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride || ride.driver?.toString() !== req.user?.userId) {
            res.status(403).json({ message: "Not authorized." });
            return;
        }
        if (ride.status !== RideStatus.ASSIGNED) {
            res.status(400).json({ message: "Ride must be ASSIGNED to start." });
            return;
        }

        ride.status = RideStatus.IN_PROGRESS;
        await ride.save();
        rideManager.updateRide(ride, "RIDE_STARTED");

        res.status(200).json({ message: "Ride started.", ride });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// PATCH /api/driver/rides/:id/complete
export const completeRide = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride || ride.driver?.toString() !== req.user?.userId) {
            res.status(403).json({ message: "Not authorized." });
            return;
        }
        if (ride.status !== RideStatus.IN_PROGRESS) {
            res.status(400).json({ message: "Ride must be IN_PROGRESS to complete." });
            return;
        }

        ride.status = RideStatus.COMPLETED;
        await ride.save();

        // Update driver earnings and make available
        await Driver.findByIdAndUpdate(req.user?.userId, {
            $inc: { totalEarnings: ride.fare },
            isAvailable: true,
        });

        rideManager.updateRide(ride, "RIDE_COMPLETED");
        rideManager.removeRide(ride._id.toString());

        res.status(200).json({ message: "Ride completed.", ride });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// GET /api/driver/rides/my  — Driver's ride history
export const getDriverRides = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const rides = await Ride.find({ driver: req.user?.userId })
            .populate("rider", "name phone rating")
            .sort({ createdAt: -1 });

        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// GET /api/driver/stats
export const getDriverStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const driver = await Driver.findById(req.user?.userId).select("-password");
        const totalCompleted = await Ride.countDocuments({
            driver: req.user?.userId,
            status: RideStatus.COMPLETED,
        });

        res.status(200).json({ driver, totalCompleted });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};