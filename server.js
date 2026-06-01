// entry point of the app
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const patientRoutes = require("./routes/patientRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const limiter = require("./middleware/rateLimiter");
const morgan = require("morgan");
const logger = require("./utils/logger");
const metricsClient = require("./config/metrics");

connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.get("/metrics", async (req, res) => {

  res.set(
    "Content-Type",
    metricsClient.register.contentType
  );

  res.end(
    await metricsClient.register.metrics()
  );
});
app.use(hpp());
app.use(morgan("dev"));
app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.get("/", (req, res) => {
  res.send("PHC API is running...");
});

app.post("/test", (req, res) => {
  console.log("TEST HIT");
  res.json({ message: "Test works" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
