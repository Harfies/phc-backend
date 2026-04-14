const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { getUsers } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const { deleteUser } = require("../controllers/authController");
const authorize = require("../middleware/roleMiddleware");
const { deletePatientByName } = require("../controllers/patientController");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new doctor or nurse
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [doctor, nurse]
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, getUsers);
router.delete("/users/:id", auth, deleteUser);
router.delete("/name/:name", auth, authorize("doctor"), deletePatientByName);

module.exports = router;
