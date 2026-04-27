# 🚗 RideLink — Your Ride, Your Way

> A ride-hailing system built as a System Design & OOP project, demonstrating real-world software architecture principles including Design Patterns, SOLID, and UML-based modeling.

🌐 **Live Demo:** [https://ridelinksysdes.netlify.app/](https://ridelinksysdes.netlify.app/)

---

## 📋 Project Overview

RideLink is a full-stack ride-hailing platform simulation that connects Riders with verified Drivers across multiple vehicle categories — Economy, Premium, Bike, and Auto. The project demonstrates applied knowledge of:

- Object-Oriented Programming (OOP) principles
- Software Design Patterns (Factory, Strategy, Observer, Singleton)
- SOLID design principles
- UML Diagrams (Use Case, Class, Sequence)
- Full-stack system architecture with a REST API backend and React frontend

The system supports JWT-based authentication, role-based access control, dynamic pricing strategies, real-time ride status tracking via the Observer pattern, and a centralized RideManager Singleton to coordinate all active rides.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Hosting** | Netlify (Frontend), configurable for any Node host |
| **Design Patterns** | Factory, Strategy, Observer, Singleton |
| **Modeling** | UML (Class, Use Case, Sequence Diagrams) |
| **Version Control** | Git / GitHub |

---

## 📁 Project Structure

```
ridelink_/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # Register, Login
│   │   │   ├── ride.controller.ts   # Book, cancel, track rides
│   │   │   └── driver.controller.ts # Accept/decline, complete rides
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT protect guard
│   │   │   └── role.middleware.ts   # Role-based authorization
│   │   ├── models/
│   │   │   ├── User.model.ts        # Rider & Driver (discriminator)
│   │   │   ├── Ride.model.ts        # Ride document
│   │   │   └── Vehicle.model.ts     # Vehicle document
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── ride.routes.ts
│   │   │   └── driver.routes.ts
│   │   ├── services/
│   │   │   ├── pricing.service.ts   # Strategy Pattern — fare calculation
│   │   │   ├── ride.service.ts      # Core ride business logic
│   │   │   └── rideManager.service.ts # Singleton + Observer Pattern
│   │   ├── types/
│   │   │   └── index.ts             # Shared enums & interfaces
│   │   └── index.ts                 # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts             # Axios instance with base URL
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── PricingCard.tsx
│   │   │   ├── RideCard.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Global auth state
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── RiderDashboard.tsx
│   │   │   └── DriverDashboard.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── assets/                          # UML diagram images
├── RideLink_Project_Report_Fixed.pdf
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Backend

```bash
cd backend
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, CLIENT_URL
npm install
npm run dev                 # starts on http://localhost:5001
```

### Frontend

```bash
cd frontend
cp .env.example .env        # set VITE_API_URL=http://localhost:5001
npm install
npm run dev                 # starts on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register as Rider or Driver |
| POST | `/api/auth/login` | — | Login, receive JWT |
| POST | `/api/rides` | Rider | Book a ride |
| GET | `/api/rides` | Rider | Get own ride history |
| PATCH | `/api/rides/:id/cancel` | Rider | Cancel a ride |
| GET | `/api/driver/requests` | Driver | View pending ride requests |
| PATCH | `/api/driver/rides/:id/accept` | Driver | Accept a ride |
| PATCH | `/api/driver/rides/:id/complete` | Driver | Complete a ride |
| GET | `/api/health` | — | Health check |

---

## 🏗️ Architecture & Design Patterns

### 1. Strategy Pattern — Dynamic Pricing (`pricing.service.ts`)
Three interchangeable pricing strategies implement `IPricingStrategy`:
- `BasePricingStrategy` — 1.0× multiplier (standard)
- `SurgePricingStrategy` — 1.8× multiplier (peak hours: 8–10am, 5–8pm)
- `NightPricingStrategy` — 1.3× multiplier (10pm–5am)

Strategy is auto-detected at booking time via `detectPricingStrategy()` and applied in `calculateFare()` using per-vehicle base rates (Economy ₹12/km, Premium ₹22/km, Bike ₹7/km, Auto ₹10/km).

### 2. Singleton + Observer Pattern — Ride Management (`rideManager.service.ts`)
`RideManager` is a Singleton — one global instance holds the `activeRides` Map. It maintains a list of `IRideObserver` implementations:
- `NotificationObserver` — logs push notification events
- `AnalyticsObserver` — logs analytics events

Every `addRide`, `updateRide`, and `removeRide` call notifies all registered observers, decoupling event consumers from ride state changes.

### 3. Factory Pattern — Vehicle & Driver Creation
`VehicleFactory` and its concrete implementations (`EconomyFactory`, `PremiumFactory`, `BikeFactory`) decouple vehicle-driver pair creation from business logic.

### 4. JWT + Role-Based Auth (Middleware)
`protect` middleware validates Bearer tokens. `authorize(...roles)` middleware enforces `RIDER` / `DRIVER` role separation on protected routes.

### Core Domain Model
- `User` (abstract) → `Rider` | `Driver` (Mongoose discriminator)
- `Ride` — links Rider, Driver, pickup/dropoff, fare, status, pricingStrategy
- `RideStatus` enum: `REQUESTED → ASSIGNED → IN_PROGRESS → COMPLETED | CANCELLED`
- `VehicleType` enum: `ECONOMY | PREMIUM | BIKE | AUTO`
- `PricingStrategy` enum: `BASE | SURGE | NIGHT`

---

## 📊 UML Diagrams

Diagrams are in `/assets/` and the project report PDF:

- **Use Case Diagram** — Actors: Rider, Driver, System. Use cases: Book Ride, Track Status, Cancel Ride, Make Payment, Rate Driver, Accept/Decline, Update Location, Complete Ride.
- **Class Diagram (Core Domain)** — `User` → `Rider`, `Driver`; `Ride`, `Vehicle`, enums
- **Class Diagram (Design Patterns)** — Factory, Strategy, Observer, Singleton hierarchies
- **Sequence Diagram** — Ride booking flow from Rider request to Driver assignment

---

## 👥 Team Members & Contributions

| Name | Role | Contributions |
|---|---|---|
| [Team Member 1] | System Architect & Lead Developer | System design, design pattern implementation, backend API |
| [Team Member 2] | Frontend Developer | React UI, auth flow, dashboards |
| [Team Member 3] | Documentation & Diagrams | UML diagrams, README, project report |

---

## 📄 License

This project is submitted as an academic project. All rights reserved by the team.
