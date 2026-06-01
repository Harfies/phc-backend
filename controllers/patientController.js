// handle patient record operations
const Patient = require("../models/patient");
const PDFDocument = require("pdfkit");
const { patientSchema } = require("../validations/patientValidation");
const logger = require("../utils/logger");
const redisClient = require("../config/redis");
const {
  getCachedPatients,
  setCachedPatients,
} = require("../cache/patientCache");

// create patient record

exports.createPatient = async (req, res) => {
  try {
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
      attachments: files || [],
    });

    // 🧹 Clear old cache
    await redisClient.del("patients");

    // Log event
    logger.info(`Patient created: ${patient.name}`);

    res.status(201).json(patient);
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// get patients with pagination + filter + Redis caching

exports.getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, date, gender, diagnosis } = req.query;

    // Convert pagination values
    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    // Build MongoDB query
    let query = {};

    // Search by patient name
    if (name) {
      query.name = new RegExp(name, "i");
    }

    // Search by date
    if (date) {
      query.dateOfVisit = new Date(date);
    }

    // Filter gender
    if (gender) {
      query.gender = gender.toLowerCase();
    }

    // Filter diagnosis
    if (diagnosis) {
      query.diagnosis = new RegExp(diagnosis, "i");
    }

    // Create unique cache key
    const cacheKey = `patients:${JSON.stringify(req.query)}`;

    // 1. Check Redis cache
    const cachedPatients = await redisClient.get(cacheKey);

    // Return cached data if available
    if (cachedPatients) {
      return res.status(200).json({
        source: "redis-cache",

        ...JSON.parse(cachedPatients),
      });
    }

    // Count total patients
    const total = await Patient.countDocuments(query);

    // Fetch patients
    const patients = await Patient.find(query)

      .skip((pageNumber - 1) * limitNumber)

      .limit(limitNumber)

      .sort({ createdAt: -1 });

    // Response object
    const responseData = {
      source: "mongodb",

      total,

      page: pageNumber,

      pages: Math.ceil(total / limitNumber),

      count: patients.length,

      data: patients,
    };

    // 2. Store response in Redis
    await redisClient.set(
      cacheKey,

      JSON.stringify(responseData),

      {
        EX: 60, // expires after 60 seconds
      },
    );

    // Return MongoDB data
    res.status(200).json(responseData);
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      msg: "Server error",
    });
  }
};
/*
// get single patient
exports.getPatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
};

// Get patient by name
exports.getPatientByName = async (req, res) => {
  try {
    const patient = await Patient.find({
      name: new RegExp(req.params.name, "i"), // case-insensitive search
    });

    if (patient.length === 0) {
      return res.status(404).json({ msg: "No patient found" });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};*/

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }
    await redisClient.flushAll();
    res.json({ msg: "Patient deleted successfully" });
    logger.warn(`Patient deleted: ${patient.name}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete patient by name (doctor only)
exports.deletePatientByName = async (req, res) => {
  try {
    // 🔐 Only doctor can delete
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Only doctors can delete patients" });
    }

    const patient = await Patient.findOneAndDelete({
      name: new RegExp(req.params.name, "i"),
    });

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    // clear cache
    await redisClient.flushAll();

    res.json({ msg: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update patient

exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedPatient) {
      return res.status(404).json({
        msg: "Patient not found",
      });
    }

    // 🧹 Clear patients cache
    await redisClient.flushAll();

    logger.info(`Patient updated: ${updatedPatient.name}`);

    res.json(updatedPatient);
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      msg: "Server error",
    });
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
