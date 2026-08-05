// handle patient record operations
const Patient = require("../models/patient");
const PDFDocument = require("pdfkit");
const {
  patientSchema,
  updatePatientSchema,
} = require("../validations/patientValidation");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");
const redisClient = require("../config/redis");
const { clearPatientCache } = require("../cache/patientCache");

// create patient record

exports.createPatient = async (req, res, next) => {
  try {
    // Normalize input
    if (req.body.gender) {
      req.body.gender = req.body.gender.trim().toLowerCase();
    }

    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }

    // Validate request body
    const { error } = patientSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Handle uploaded files
    const files = req.files ? req.files.map((file) => file.path) : [];

    // Create patient
    const patient = await Patient.create({
      ...req.body,
      attachments: files,
    });

    // Clear patient cache
    await clearPatientCache();

    logger.info(`Patient created: ${patient.name}`);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Get all patients with pagination, search, filtering and Redis caching

exports.getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, gender, diagnosis, date } = req.query;

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.max(parseInt(limit) || 10, 1);

    const query = {};

    // Search patient by name (case-insensitive)
    if (name) {
      query.name = {
        $regex: name,
        $options: "i",
      };
    }

    // Filter by gender
    if (gender) {
      query.gender = gender.toLowerCase();
    }

    // Filter by diagnosis
    if (diagnosis) {
      query.diagnosis = {
        $regex: diagnosis,
        $options: "i",
      };
    }

    // Filter by visit date
    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setDate(end.getDate() + 1);

      query.dateOfVisit = {
        $gte: start,
        $lt: end,
      };
    }

    const cacheKey = `patients:${JSON.stringify(req.query)}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        source: "redis-cache",
        ...JSON.parse(cachedData),
      });
    }

    const total = await Patient.countDocuments(query);

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const response = {
      source: "mongodb",
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      count: patients.length,
      data: patients,
    };

    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 60,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Delete patient
// Delete patient by ID (Doctor only)
exports.deletePatient = async (req, res) => {
  try {
    // Only doctors can delete patients
    if (req.user.role !== "doctor") {
      return next(new AppError("Only doctors can delete patients", 403));
    }

    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return next(new AppError("Patient not found", 404));
    }

    // Clear patient cache
    await clearPatientCache();

    logger.warn(`Patient deleted: ${patient.name}`);

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update patient by ID
exports.updatePatient = async (req, res) => {
  try {
    // Validate request body
    const { error } = updatePatientSchema.validate(req.body, {
      allowUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Clear patient cache
    await clearPatientCache();

    logger.info(`Patient updated: ${updatedPatient.name}`);

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

//EXPORT PDF

exports.exportPDF = async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.text(`Name: ${patient.name}`);
  doc.text(`Diagnosis: ${patient.diagnosis}`);
  doc.text(`Treatment: ${patient.treatment}`);

  doc.pipe(res);
  doc.end();
};
