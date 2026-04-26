"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const types_1 = require("../types");
const Vehicle_model_1 = __importDefault(require("../models/Vehicle.model"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect, (0, auth_middleware_1.authorize)(types_1.UserRole.DRIVER));
// GET /api/driver/vehicle — get own vehicle
router.get('/vehicle', async (req, res) => {
    try {
        const vehicle = await Vehicle_model_1.default.findOne({ driver: req.user?.userId });
        res.json({ vehicle });
    }
    catch {
        res.status(500).json({ message: 'Server error.' });
    }
});
exports.default = router;
