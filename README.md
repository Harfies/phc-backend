# 🏥 PHC Backend API

A secure REST API for managing patient records in a Primary Health Care center.

## 🚀 Features

- JWT Authentication (Doctor/Nurse)
- Patient record management (CRUD)
- File upload support
- Pagination & filtering
- Role-based access (doctor-only delete)

## 🛠 Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose

## 🔗 Live API

https://phc-backend-4q48.onrender.com/

## 📌 Endpoints

POST /api/auth/register  
POST /api/auth/login  
GET /api/patients  
POST /api/patients  
PUT /api/patients/:id  
DELETE /api/patients/:id

## 🧪 Testing

Use Postman to test endpoints with JWT token.

## 🔑 How to Test

1. Register user
2. Login → get token
3. Use token in Authorization header
4. Create patient
