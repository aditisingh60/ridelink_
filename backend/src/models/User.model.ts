import mongoose, { Schema, Document, Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { UserRole, VehicleType } from "../types";

// Base User Interface
export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Rider-specific fields
export interface IRiderDocument extends IUserDocument {
    totalRides: number;
    rating: number;
}

// Driver-specific fields
export interface IDriverDocument extends IUserDocument {
    vehicleType: VehicleType;
    vehicleNumber: string;
    isAvailable: boolean;
    totalEarnings: number;
    rating: number;
    currentLocation?: { lat: number; lng: number };
}

// Base User Schema
const userOptions = { discriminatorKey: "role", timestamps: true };

const UserSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: Object.values(UserRole), required: true },
        phone: { type: String, required: true },
    },
    userOptions
);

// Hash password before save
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Base User Model
const User = mongoose.model<IUserDocument>("User", UserSchema);

// Rider Discriminator
const RiderSchema = new Schema<IRiderDocument>({
    totalRides: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
});
export const Rider = User.discriminator<IRiderDocument>(
    UserRole.RIDER,
    RiderSchema
);

// Driver Discriminator
const DriverSchema = new Schema<IDriverDocument>({
    vehicleType: {
        type: String,
        enum: Object.values(VehicleType),
        required: true,
    },
    vehicleNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number },
    },
});
export const Driver = User.discriminator<IDriverDocument>(
    UserRole.DRIVER,
    DriverSchema
);

export default User;