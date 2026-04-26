"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingStrategy = exports.UserRole = exports.VehicleType = exports.RideStatus = void 0;
// Enums
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "REQUESTED";
    RideStatus["ASSIGNED"] = "ASSIGNED";
    RideStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["ECONOMY"] = "ECONOMY";
    VehicleType["PREMIUM"] = "PREMIUM";
    VehicleType["BIKE"] = "BIKE";
    VehicleType["AUTO"] = "AUTO";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var UserRole;
(function (UserRole) {
    UserRole["RIDER"] = "RIDER";
    UserRole["DRIVER"] = "DRIVER";
})(UserRole || (exports.UserRole = UserRole = {}));
var PricingStrategy;
(function (PricingStrategy) {
    PricingStrategy["BASE"] = "BASE";
    PricingStrategy["SURGE"] = "SURGE";
    PricingStrategy["NIGHT"] = "NIGHT";
})(PricingStrategy || (exports.PricingStrategy = PricingStrategy = {}));
