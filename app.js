require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const patientRoutes = require("./routes/patientRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const limiter = require("./middleware/rateLimiter");
const morgan = require("morgan");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const metricsClient = require("./config/metrics");

const app = express();

//Middleware

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // Add your deployed Next.js frontend URL here later
    ],

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", metricsClient.register.contentType);

  res.end(await metricsClient.register.metrics());
});
app.use(hpp());
app.use(morgan("dev"));
app.use(limiter);
app.use(helmet());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.get("/", (req, res) => {
  res.send("PHC API is running...");
});

app.use(errorHandler);

module.exports = app;
