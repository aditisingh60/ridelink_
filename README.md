# 🚗 RideLink — Your Ride, Your Way

> A ride-hailing system built as a System Design & OOP project, demonstrating real-world software architecture principles including Design Patterns, SOLID, and UML-based modeling.

🌐 **Live Demo:** [https://ridelinksysdes.netlify.app/](https://ridelinksysdes.netlify.app/)

---

## 📋 Project Overview

RideLink is a full-featured ride-hailing platform simulation that connects Riders with verified Drivers across multiple vehicle categories — Economy, Premium, Bike, and Auto. The project is designed to demonstrate applied knowledge of:

- Object-Oriented Programming (OOP) principles
- Software Design Patterns (Factory, Strategy, Observer, Singleton)
- SOLID design principles
- UML Diagrams (Use Case, Class, Sequence)
- Scalable system architecture

The system supports real-time ride matching, dynamic pricing strategies, live status tracking via the Observer pattern, and a single centralized RideManager instance to coordinate all active rides.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Hosting** | Netlify (Static Deployment) |
| **Architecture** | OOP + Design Patterns (no backend framework) |
| **Design Patterns** | Factory, Strategy, Observer, Singleton |
| **Modeling** | UML (Class, Use Case, Sequence Diagrams) |
| **Version Control** | Git / GitHub |

> Note: This is a frontend-only simulation project. All logic is implemented in JavaScript following OOP and design pattern principles. No backend server or database is used — the focus is on demonstrating system design concepts in code.

---

## 📁 Project Structure

```
ridelink/
├── index.html          # Main HTML page
├── style.css           # Styling and responsive layout
├── app.js              # Core application logic (OOP + Design Patterns)
├── README.md           # Project documentation
└── assets/             # Images and static assets
```

---

## ⚙️ Setup & Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- Git (optional, for cloning)
- A code editor like VS Code (optional, for development)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/ridelink.git
   cd ridelink
   ```

2. **Open the project**

   Simply open `index.html` in your browser:
   ```bash
   # On Linux/macOS
   open index.html

   # On Windows
   start index.html
   ```

   Or use VS Code's Live Server extension for a better development experience.

3. **No build step required** — this is a pure HTML/CSS/JS project with no dependencies or package managers.

---

## 🚀 How to Run the Project

### Option 1 — Live (Deployed)
Visit the live site directly: **[https://ridelinksysdes.netlify.app/](https://ridelinksysdes.netlify.app/)**

### Option 2 — Local
1. Clone or download the repository
2. Open `index.html` in any browser
3. Interact with the booking widget, pricing section, driver dashboard, and Observer pattern demo

### Key Features to Explore
- **Book a Ride** — Select vehicle type, see dynamic fare calculation
- **Pricing Section** — View Base, Surge, and Night pricing strategies with multipliers
- **Observer Demo** — Click "Simulate Status Change" to see real-time notifications fire
- **Driver Dashboard** — Accept/Decline ride requests, view earnings
- **Architecture Section** — Visual explanation of all 4 design patterns used

---

## 🏗️ Architecture Explanation

RideLink's architecture is built around four classic Gang of Four (GoF) design patterns:

### 1. Factory Pattern — Vehicle & Driver Creation
The `VehicleFactory` interface is implemented by `EconomyFactory`, `PremiumFactory`, and `BikeFactory`. Each factory is responsible for creating the correct vehicle-driver pair for a given ride type, decoupling object creation from business logic.

### 2. Strategy Pattern — Dynamic Pricing
The `PricingStrategy` interface is implemented by three concrete strategies:
- `BasePricing` — Standard fixed-rate (1.0× multiplier)
- `SurgePricing` — Peak-hour dynamic pricing (example: 1.8× multiplier)
- `NightPricing` — Late-night enhanced rates (1.3× multiplier)

Strategies are interchangeable at runtime without modifying the core fare calculation logic.

### 3. Observer Pattern — Real-Time Status Updates
The `RideObserver` interface is implemented by `NotificationService` and `AnalyticsService`. Whenever a ride's status changes, all registered observers are notified simultaneously — enabling real-time push notifications and analytics tracking independently.

### 4. Singleton Pattern — Centralized Ride Management
`RideManager` is a Singleton — only one instance exists globally. It maintains the `activeRides` map, preventing race conditions and ensuring consistent state across all ride operations.

### Core Domain Model
- `User` (abstract) → extended by `Rider` and `Driver`
- `Rider` books and cancels rides; `Driver` accepts rides and updates location
- `Ride` links a Rider, Driver, pickup/dropoff locations, status, and fare
- `RideStatus` enum: `REQUESTED → ASSIGNED → IN_PROGRESS → COMPLETED`
- `VehicleType` enum: `ECONOMY | PREMIUM | BIKE | AUTO`

---

## 👥 Team Members & Contributions

| Name | Role | Contributions |
|---|---|---|
| [Team Member 1] | System Architect & Lead Developer | System design, design pattern implementation, core OOP model |
| [Team Member 2] | Frontend Developer | UI/UX design, HTML/CSS, interactive booking widget |
| [Team Member 3] | Documentation & Diagrams | UML diagrams (Use Case, Class, Sequence), README, project report |

> Replace the above with your actual team member names and roles.

---

## 📊 UML Diagrams

All UML diagrams are included in the project report. A summary:

- **Use Case Diagram** — Actors: Rider, Driver, System. Use cases include Book Ride, Track Status, Cancel Ride, Make Payment, Rate Driver, Accept/Decline Requests, Update Location, Complete Ride.
- **Class Diagram (Core Domain)** — Abstract `User` → `Rider`, `Driver`; `Ride`, `Vehicle`, enums `RideStatus`, `VehicleType`
- **Class Diagram (Design Patterns)** — Factory, Strategy, Observer, Singleton hierarchies
- **Sequence Diagram** — Ride booking workflow from Rider request to Driver assignment

---

## 📄 License

This project is submitted as an academic project. All rights reserved by the team.
