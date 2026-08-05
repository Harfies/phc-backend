const Joi = require("joi");

// Patient validation schema
const patientSchema = Joi.object({
  // Patient full name
  name: Joi.string().min(3).max(100).required(),

  // Patient age
  age: Joi.number().integer().min(0).max(120).required(),

  // Gender validation
  gender: Joi.string().valid("male", "female").required(),

  // Date of visit
  dateOfVisit: Joi.date().required(),

  // Diagnosis field
  diagnosis: Joi.string().min(3).required(),

  // Treatment / prescription
  treatment: Joi.string().min(3).required(),

  // Optional notes
  notes: Joi.string().allow(""),
});

// Update Patient (all fields optional)
const updatePatientSchema = Joi.object({
  name: Joi.string(),
  age: Joi.number(),
  gender: Joi.string(),
  diagnosis: Joi.string(),
  treatment: Joi.string(),
  notes: Joi.string().allow(""),
}).min(1);

module.exports = {
  patientSchema,
  updatePatientSchema,
};
