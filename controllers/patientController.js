// handle patient record operations
const Patient = require("../models/patient");
const PDFDocument = require("pdfkit");

// create patient record
exports.createPatient = async (req, res) => {
  const files = req.files ? req.files.map((file) => file.path) : [];

  const patient = await Patient.create({
    ...req.body,
    attachments: files || [],
  });
  res.json(patient);
};
/*
// get all patients
exports.getPatients = async (req, res) => {
  const { name, date } = req.query;

  let query = {};

  if (name) query.name = new RegExp(name, "i");
  if (date) query.dateOfVisits = new Date(date);

  const patients = await Patient.find(query);
  res.json(patients);
};*/

// get patients with pagination + filter
exports.getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, date } = req.query;

    // convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // build query
    let query = {};

    if (name) {
      query.name = new RegExp(name, "i");
    }

    if (date) {
      query.dateOfVisit = new Date(date);
    }

    //count total patient
    const total = await Patient.countDocuments(query);

    //fetch patients with pagination
    const patients = await Patient.find(query)
      .skip((pageNumber - 1) * limitNumber) // skip previous pages
      .limit(limitNumber) // limit per page
      .sort({ createdAt: -1 }); // newest first

    res.json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

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
};

// ADD DELETE AND UPDATE

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

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
      { new: true }, // return updated data
    );

    if (!updatedPatient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(updatedPatient);
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

    res.json({ msg: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update patient by name
exports.updatePatientByName = async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { name: new RegExp(req.params.name, "i") },
      req.body,
      { new: true },
    );

    if (!updatedPatient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
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
