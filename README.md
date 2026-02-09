🍽️ Dine-IN-Live

  Live Mess Management System

<p align="center"> <img src="https://img.shields.io/badge/React-18-blue?logo=react" /> <img src="https://img.shields.io/badge/Vite-5-purple?logo=vite" /> <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js" /> <img src="https://img.shields.io/badge/Express.js-Backend-black?logo=express" /> <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb" /> <img src="https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss" /> </p>
  1.📌 Overview
  
  Dine-IN-Live is a full-stack web application that connects students with nearby mess and tiffin services. Students can browse messes, view menus, place orders, and track   order history. Mess owners can register their mess, manage menus, and handle orders.
  
  The frontend is built using React + Vite, while the backend uses Node.js, Express.js, and MongoDB with JWT authentication.
  
  This project is developed as a PBL Mini Project for SE Computer Engineering (SPPU).
  
  2. 🚀 Features
     
    👨‍🎓 Student
    
      Register & Login
      
      Search nearby messes
      
      View mess details & menu
      
      Place orders
      
      Order history
      
      Profile management
    
    🧑‍🍳 Mess Owner
    
      Register mess
      
      Mess owner dashboard
      
      Add / Delete menu items
    
    👨‍💼 Admin
    
      Admin panel
      
      Manage users & mess owners
    
    🔐 Security
    
      Password hashing (bcrypt)
      
      JWT authentication
      
      Protected API routes
  
  3. 🛠️ Tech Stack
  
    Frontend: React.js, Vite, Tailwind CSS
    Backend: Node.js, Express.js
    Database: MongoDB
  
  4. 📁 Project Structure
    DINE IN LIVE R/
    │
    ├── Backend/
    │   └── server/
    │       ├── global2.js
    │       ├── package.json
    │       └── package-lock.json
    │
    ├── DineInLive/
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/
    │   │   │   ├── Header.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── pages/
    │   │   │   ├── AdminPanel.jsx
    │   │   │   ├── Favorites.jsx
    │   │   │   ├── Home.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── MessDetails.jsx
    │   │   │   ├── MessOwner.jsx
    │   │   │   ├── MessOwnerDashBoard.jsx
    │   │   │   ├── OrderHistory.jsx
    │   │   │   ├── PartnerInfo.jsx
    │   │   │   ├── PartnerWithUs.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   └── SearchMess.jsx
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   │
    │   ├── index.html
    │   ├── package.json
    │   ├── tailwind.config.js
    │   ├── postcss.config.js
    │   └── vite.config.js
    │
    └── README.md
  
  5. 🔗 API Overview
    Auth
    
      POST /register
      
      POST /login
    
    Mess
    
      GET /api/messes
      
      POST /register-mess 🔒
      
      GET /api/my-mess 🔒
    
    Menu
    
      POST /api/messes/:id/menu 🔒
      
      DELETE /api/messes/:messId/menu/:itemId 🔒
      
    Orders
    
      POST /api/orders 🔒
      
      GET /api/user/orders 🔒
    
    User
    
      GET /api/user/profile 🔒
      
      🔒 = Requires JWT Token
  
  6. 🎯 Project Objective
  
    To reduce the communication gap between students and mess owners by providing a centralized digital platform for food discovery, ordering, and mess management.
  
  7. 🔮 Future Enhancements
  
    Online payment integration
    
    Real-time order tracking
    
    Google Maps integration
    
    Mobile responsive UI
    
    Push notifications
