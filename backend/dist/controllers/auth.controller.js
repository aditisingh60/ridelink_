"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const User_model_1 = __importStar(require("../models/User.model"));
const types_1 = require("../types");
const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || "ridelink_secret", { expiresIn: "7d" });
};
// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, phone, role, vehicleType, vehicleNumber } = req.body;
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        }
        let newUser;
        if (role === types_1.UserRole.DRIVER) {
            if (!vehicleType || !vehicleNumber) {
                res
                    .status(400)
                    .json({ message: "Drivers must provide vehicle type and number." });
                return;
            }
            newUser = await User_model_1.Driver.create({
                name,
                email,
                password,
                phone,
                role: types_1.UserRole.DRIVER,
                vehicleType,
                vehicleNumber,
            });
        }
        else {
            newUser = await User_model_1.Rider.create({
                name,
                email,
                password,
                phone,
                role: types_1.UserRole.RIDER,
            });
        }
        const token = generateToken(newUser._id.toString(), newUser.role);
        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration." });
    }
};
exports.register = register;
// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }
        const token = generateToken(user._id.toString(), user.role);
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};
exports.login = login;
// GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User_model_1.default.findById(req.user?.userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
exports.getMe = getMe;
