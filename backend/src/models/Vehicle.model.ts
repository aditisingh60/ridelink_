import mongoose, { Schema, Document } from 'mongoose'
import { VehicleType } from '../types'

export interface IVehicleDocument extends Document {
  driver: mongoose.Types.ObjectId
  type: VehicleType
  number: string
  vehicleModel: string
  color: string
}

const VehicleSchema = new Schema<IVehicleDocument>(
  {
    driver: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    type: { type: String, enum: Object.values(VehicleType), required: true },
    number: { type: String, required: true },
    vehicleModel: { type: String, default: 'Unknown' },
    color: { type: String, default: 'White' },
  },
  { timestamps: true }
)

export default mongoose.model<IVehicleDocument>('Vehicle', VehicleSchema)
