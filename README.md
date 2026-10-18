🏥 PHC Backend API

A secure, production-ready REST API for managing patient records in a Primary Health Care center.

🚀 Features
JWT Authentication (Doctor/Nurse)
Role-Based Access Control (RBAC)
Patient record management (CRUD)
File upload support (Lab results, scans)
Pagination, filtering & search
Case-insensitive patient queries
Doctor-only delete permissions
Redis caching for performance ⚡
Idempotency support (prevents duplicate requests)
Swagger API documentation
PDF export of patient records
Request validation (Joi)
Secure logging (Morgan + Winston)
Prometheus metrics endpoint
Rate limiting (API protection)

🛠 Tech Stack
Node.js
Express
MongoDB
Mongoose
Redis
JWT
Multer
PDFKit
Joi
Morgan
Winston
Prometheus Client
Swagger UI

🔗 Live API

https://phc-backend-v9mb.onrender.com 
📌 API Versioning

All endpoints are versioned:

/api/v1

Example:

/api/v1/auth/register
/api/v1/auth/login
/api/v1/patients

📌 Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
Patients
GET /api/patients
POST /api/patients
PUT /api/patients/:id
DELETE /api/patients/:id
GET /api/patients/:id
GET /api/patients/name/:name

⚡ Performance Features
Redis caching for faster responses
Cached GET requests for patients
Automatic cache invalidation on create/update/delete
Optimized pagination queries

🛡 Security Features
JWT authentication
Helmet security headers
Input validation (Joi)
MongoDB sanitization
HTTP parameter pollution protection
CORS enabled
Role-based authorization

📊 Observability
Morgan HTTP request logging
Winston file logging (error + combined logs)
Prometheus /metrics endpoint

📄 API Documentation

Swagger Docs:

https://https://phc-backend-v9mb.onrender.com/api-docs/

🔑 How to Test
Register user
Login → get JWT token
Add token to headers:
Authorization: Bearer <token>
Create patient
Test filtering, pagination, and search

⚡ Idempotency (Important)

To prevent duplicate requests:

Idempotency-Key: unique-key

Used for safe retries (especially POST requests).

📊 Metrics Endpoint
GET /metrics

Used for Prometheus monitoring.

📁 Logging

Logs stored in:

/logs/combined.log
/logs/error.log
🚀 Deployment

Deployed on Render:

https://phc-backend-fqt7.onrender.com

🔮 Future Improvements
Docker support
BullMQ background jobs
Email notifications
CI/CD pipeline (GitHub Actions)
Automated testing (Jest + Supertest)
Grafana dashboard integration

👨‍💻 Author

Afeez Akinsola
Backend Developer | Node.js | Express | MongoDB | System Design
