import Ride from '../models/Ride.model'
import { VehicleType, RideStatus, PricingStrategy } from '../types'
import { calculateFare, detectPricingStrategy } from './pricing.service'
import RideManager from './rideManager.service'

const rideManager = RideManager.getInstance()

/**
 * Factory: Creates a ride document with fare calculated by pricing strategy.
 */
export async function createRide(params: {
  riderId: string
  pickup: string
  dropoff: string
  vehicleType: VehicleType
  distanceKm: number
}) {
  const { riderId, pickup, dropoff, vehicleType, distanceKm } = params
  const strategy: PricingStrategy = detectPricingStrategy()
  const fare = calculateFare(vehicleType, distanceKm, strategy)

  const ride = await Ride.create({
    rider: riderId,
    pickup,
    dropoff,
    vehicleType,
    status: RideStatus.REQUESTED,
    pricingStrategy: strategy,
    fare,
    distance: distanceKm,
  })

  // Register in singleton & notify observers
  rideManager.addRide(ride)
  return ride
}

export async function getRideById(id: string) {
  return Ride.findById(id).populate('rider', 'name phone').populate('driver', 'name phone')
}
