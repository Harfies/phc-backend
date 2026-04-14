const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createPatient,
  getPatients,
  getPatient,
  exportPDF,
} = require("../controllers/patientController");
const { getPatientByName } = require("../controllers/patientController");
const { deletePatient } = require("../controllers/patientController");
const { updatePatient } = require("../controllers/patientController");
const { deletePatientByName } = require("../controllers/patientController");
const { updatePatientByName } = require("../controllers/patientController");

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients (with pagination)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 */

/**
 * @swagger
 * /api/patients:
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

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get a single patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete patient (doctor only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */

router.post("/", auth, upload.array("files"), createPatient);
router.get("/", auth, getPatients);
router.get("/:id/export", auth, exportPDF);
router.get("/name/:name", auth, getPatientByName);
router.put("/name/:name", auth, updatePatientByName);
router.delete("/name/:name", auth, deletePatientByName);
router.get("/:id", auth, getPatient);
router.delete("/:id", auth, deletePatient);
router.put("/:id", auth, updatePatient);

module.exports = router;
