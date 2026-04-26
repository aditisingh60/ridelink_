export enum RideStatus {
  REQUESTED = 'REQUESTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum VehicleType {
  ECONOMY = 'ECONOMY',
  PREMIUM = 'PREMIUM',
  BIKE = 'BIKE',
  AUTO = 'AUTO',
}

export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
}

export enum PricingStrategy {
  BASE = 'BASE',
  SURGE = 'SURGE',
  NIGHT = 'NIGHT',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
}

export interface IRide {
  _id: string;
  rider: string | IUser;
  driver?: string | IUser;
  pickup: string;
  dropoff: string;
  vehicleType: VehicleType;
  status: RideStatus;
  pricingStrategy: PricingStrategy;
  fare: number;
  distance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  vehicleType?: VehicleType;
  vehicleNumber?: string;
}

export interface BookRidePayload {
  pickup: string;
  dropoff: string;
  vehicleType: VehicleType;
  distance: number;
}
