import mongoose, { Schema, Document } from "mongoose";
import { RideStatus, VehicleType, PricingStrategy } from "../types";

export interface IRideDocument extends Document {
    rider: mongoose.Types.ObjectId;
    driver?: mongoose.Types.ObjectId;
    pickup: string;
    dropoff: string;
    vehicleType: VehicleType;
    status: RideStatus;
    pricingStrategy: PricingStrategy;
    fare: number;
    distance: number;
    createdAt: Date;
    updatedAt: Date;
}

const RideSchema = new Schema<IRideDocument>(
    {
        rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
        driver: { type: Schema.Types.ObjectId, ref: "User" },
        pickup: { type: String, required: true },
        dropoff: { type: String, required: true },
        vehicleType: {
            type: String,
            enum: Object.values(VehicleType),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.REQUESTED,
        },
        pricingStrategy: {
            type: String,
            enum: Object.values(PricingStrategy),
            default: PricingStrategy.BASE,
        },
        fare: { type: Number, required: true },
        distance: { type: Number, required: true }, // in km
    },
    { timestamps: true }
);

export default mongoose.model<IRideDocument>("Ride", RideSchema);