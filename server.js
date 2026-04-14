// entry point of the app
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const patientRoutes = require("./routes/patientRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
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
