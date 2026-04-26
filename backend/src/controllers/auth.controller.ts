import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User, { Rider, Driver } from "../models/User.model";
import { UserRole, VehicleType } from "../types";

const generateToken = (userId: string, role: UserRole): string => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || "ridelink_secret",
        { expiresIn: "7d" }
    );
};

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, role, vehicleType, vehicleNumber } =
            req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        }

        let newUser;

        if (role === UserRole.DRIVER) {
            if (!vehicleType || !vehicleNumber) {
                res
                    .status(400)
                    .json({ message: "Drivers must provide vehicle type and number." });
                return;
            }
            newUser = await Driver.create({
                name,
                email,
                password,
                phone,
                role: UserRole.DRIVER,
                vehicleType,
                vehicleNumber,
            });
        } else {
            newUser = await Rider.create({
                name,
                email,
                password,
                phone,
                role: UserRole.RIDER,
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};