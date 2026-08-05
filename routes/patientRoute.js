const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createPatient,
  getPatients,
  exportPDF,
  deletePatient,
  updatePatient,
} = require("../controllers/patientController");
const idempotency = require("../middleware/idempotency");

/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     summary: Get all patients or search patients by name
 *     description: |
 *       Returns a paginated list of patients.
 *       If the **name** query parameter is provided, the API searches for patients whose names match the supplied value.
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Search patient by name
 *         example: John
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of patients per page
 *
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               total: 2
 *               page: 1
 *               pages: 1
 *               data:
 *                 - _id: "6890b2a4d3a2..."
 *                   name: "John Doe"
 *                   age: 35
 *                   gender: "male"
 *                   diagnosis: "Malaria"
 *                 - _id: "6890b2a4d3a3..."
 *                   name: "John Michael"
 *                   age: 28
 *                   gender: "male"
 *                   diagnosis: "Typhoid"
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid token
 */
router.get("/", auth, getPatients);

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient created
 */
router.post("/", auth, idempotency, upload.array("files"), createPatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   patch:
 *     summary: Update a patient
 *     description: Update an existing patient by ID.
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: string
 *           example: 68906b5e8f123456789abcd1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */
router.patch("/:id", auth, updatePatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     description: Deletes a patient by ID. Only doctors can perform this action.
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: string
 *           example: 68906b5e8f123456789abcd1
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Doctor access required
 *       404:
 *         description: Patient not found
 */
router.delete("/:id", auth, deletePatient);

router.get("/:id/export", auth, exportPDF);

module.exports = router;
