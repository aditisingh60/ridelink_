import { Router } from "express";
import {
    acceptRide,
    startRide,
    completeRide,
    getDriverRides,
    getDriverStats,
} from "../controllers/driver.controller";
import { protect, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../types";

const router = Router();

router.use(protect, authorize(UserRole.DRIVER));

router.patch("/rides/:id/accept", acceptRide);
router.patch("/rides/:id/start", startRide);
router.patch("/rides/:id/complete", completeRide);
router.get("/rides/my", getDriverRides);
router.get("/stats", getDriverStats);

export default router;