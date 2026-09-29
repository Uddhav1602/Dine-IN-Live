# 🍽️ Dine-IN-Live: Comprehensive Project Report

## 1. Project Overview
**Dine-IN-Live** is a comprehensive full-stack web application designed to bridge the gap between students and local mess/tiffin services. It serves as a centralized digital platform for food discovery, ordering, and mess management. 

- **Primary Goal:** To reduce the communication gap between students and mess owners.
- **Architecture:** Client-Server model (Frontend Single Page Application communicating with a RESTful Backend API).

## 2. Technology Stack
### Frontend (Client-Side)
- **Framework:** React.js (v19)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Routing:** React Router DOM
- **State Management & Hooks:** React Hooks (`useState`, `useEffect`)

### Backend (Server-Side)
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM (Object Data Modeling):** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** bcryptjs (Password Hashing), CORS (Cross-Origin Resource Sharing)

## 3. Core Roles & Features

### 👨‍🎓 Student (User Role)
The primary consumer of the application.
- **Authentication:** Secure Registration and Login.
- **Discovery:** Browse and search for nearby messes.
- **Engagement:** View detailed information about messes, including their location and current menu.
- **Transactions:** Place food orders from selected messes.
- **Tracking:** View order history.
- **Personalization:** Manage user profile and favorites.

### 🧑‍🍳 Mess Owner (Mess_Owner Role)
The service provider.
- **Onboarding:** Register their mess on the platform (automatically upgrades their account role to `mess_owner`).
- **Management Dashboard:** Access a dedicated dashboard for mess operations.
- **Menu Management:** Dynamically add or delete items from their mess's menu.

### 👨‍💼 Administrator (Admin Role)
The platform maintainer.
- **Platform Oversight:** Dedicated Admin Panel.
- **User Management:** View all registered users and delete user accounts if necessary.
- **Role Management:** Promote standard users to the Admin role.
- **Universal Access:** Admins inherently have access to mess owner functionalities as well.

## 4. Database Architecture (MongoDB Schemas)

### `User` Schema
Stores all user information and their specific role in the platform.
- `username` (String, Unique)
- `email` (String, Unique)
- `phone` (String)
- `address` (String)
- `password` (String, Hashed)
- `role` (Enum: `user`, `mess_owner`, `admin`) - Defaults to `user`

### `Mess` Schema
Stores details about the mess establishment and its menu.
- `name` (String, Unique)
- `location` (String)
- `fullAddress` (String)
- `ownerPhone` (String)
- `email` (String)
- `ownerId` (ObjectId, Ref: User)
- `rating` (Number)
- `menuItems` (Array of Objects containing `name`, `price`, `contents`)

### `Order` Schema
Tracks food orders placed by users.
- `userId` (ObjectId, Ref: User)
- `messId` (ObjectId, Ref: Mess)
- `messName` (String)
- `items` (Array of Objects containing `name`, `price`, `quantity`)
- `totalAmount` (Number)
- `status` (String) - Defaults to `Pending`
- `createdAt` (Date)

## 5. Security & Authentication Flow
- **Password Protection:** All user passwords are one-way hashed using `bcryptjs` before being stored in the database.
- **Session Management:** Upon successful login or mess registration, the server issues a **JWT (JSON Web Token)** containing the user's ID and role.
- **Protected Routes:** The frontend uses wrapper components (`ProtectedRoute`, `AdminRoute`, `MessOwnerRoute`) to restrict UI access. The backend uses middleware (`verifyToken`, `verifyAdmin`, `verifyMessOwner`) to secure API endpoints, ensuring users can only perform actions permitted by their role.

## 6. REST API Endpoints Overview

### Authentication
- `POST /register`: Create a new user account.
- `POST /login`: Authenticate user and return JWT.

### Mess Management
- `GET /api/messes`: Retrieve all messes.
- `GET /api/messes/:id`: Retrieve specific mess details.
- `POST /register-mess` **(Protected)**: Register a new mess and upgrade user to `mess_owner`.
- `GET /api/my-mess` **(Protected)**: Retrieve the mess owned by the logged-in user.
- `DELETE /api/messes/:id` **(Admin/Owner)**: Delete a mess.

### Menu Operations
- `POST /api/messes/:id/menu` **(Protected)**: Add an item to a mess menu.
- `DELETE /api/messes/:messId/menu/:itemId` **(Protected)**: Remove an item from a mess menu.

### Order Processing
- `POST /api/orders` **(Protected)**: Place a new order.
- `GET /api/user/orders` **(Protected)**: Retrieve order history for the logged-in user.

### User & Admin Operations
- `GET /api/user/profile` **(Protected)**: Get logged-in user's profile details.
- `GET /api/admin/users` **(Admin)**: List all platform users.
- `DELETE /api/admin/users/:id` **(Admin)**: Remove a user from the platform.
- `POST /api/admin/make-admin` **(Admin)**: Promote a user to Admin.
- `POST /api/admin/seed-admin`: Bootstrap the first admin account (only works if no admins exist).

## 7. Project Structure
The repository is split into two distinct applications:

- **/Backend:** Contains the Node.js/Express server.
  - Entry point: `server/global2.js` (Handles DB connection, schemas, routes, and middleware all in one file).
- **/DineInLive:** Contains the React.js frontend application.
  - `src/App.jsx`: Manages all application routing and route protection.
  - `src/pages/`: Contains all the screen components (Home, Login, AdminPanel, etc.).
  - `src/components/`: Reusable UI components like Header and Footer.

## 8. Future Enhancements & Scalability
- **Payment Gateway Integration:** To support online payments for orders.
- **Live Tracking:** Real-time updates on order preparation and delivery.
- **Geospatial Queries:** Integration with Google Maps to show exact locations.
- **Code Refactoring:** Splitting the monolithic `global2.js` backend file into separate `controllers`, `routes`, and `models` directories for better maintainability as the project scales.
