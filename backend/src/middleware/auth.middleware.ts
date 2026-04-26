import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types";

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const protect = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided. Access denied." });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "ridelink_secret"
        ) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Role-based authorization
export const authorize =
    (...roles: UserRole[]) =>
        (req: Request, res: Response, next: NextFunction): void => {
            if (!req.user || !roles.includes(req.user.role)) {
                res.status(403).json({
                    message: `Access denied. Required role: ${roles.join(" or ")}`,
                });
                return;
            }
            next();
        };