const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { getUsers } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const { deleteUser } = require("../controllers/authController");
const authorize = require("../middleware/roleMiddleware");

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new doctor or nurse
 *     description: Creates a new user account and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: doctor@test.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               role:
 *                 type: string
 *                 enum:
 *                   - doctor
 *                   - nurse
 *                 example: doctor
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User registered successfully
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error or user already exists.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User already exists
 *       500:
 *         description: Internal server error.
 */
router.post("/register", register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: doctor@test.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     summary: Get all registered users
 *     description: Returns a list of all doctors and nurses. Authentication required.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/users", auth, getUsers);

/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Only doctors are authorized to perform this action.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB User ID
 *         schema:
 *           type: string
 *           example: 68907b8d9c4f8a1234567890
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Doctor role required.
 *       404:
 *         description: User not found.
 */
router.delete("/users/:id", auth, authorize("doctor"), deleteUser);

module.exports = router;
