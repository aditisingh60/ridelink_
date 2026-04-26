import { Router } from "express";
import {
    bookRide,
    getMyRides,
    getAvailableRides,
    cancelRide,
    getFareEstimate,
} from "../controllers/ride.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/auth.middleware";
import { UserRole } from "../types";

const router = Router();

router.use(protect);

router.post("/book", authorize(UserRole.RIDER), bookRide);
router.get("/my", authorize(UserRole.RIDER), getMyRides);
router.patch("/:id/cancel", authorize(UserRole.RIDER), cancelRide);
router.get("/available", authorize(UserRole.DRIVER), getAvailableRides);
router.get("/fare-estimate", getFareEstimate);

export default router;