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
