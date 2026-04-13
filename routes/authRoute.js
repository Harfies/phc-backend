const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { getUsers } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const { deleteUser } = require("../controllers/authController");
const authorize = require("../middleware/roleMiddleware");
const { deletePatientByName } = require("../controllers/patientController");

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, getUsers);
router.delete("/users/:id", auth, deleteUser);
router.delete("/name/:name", auth, authorize("doctor"), deletePatientByName);

module.exports = router;
