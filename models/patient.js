// patient record model
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      lowercase: true, // Convert to lowercase for consistency
      enum: ["male", "female"],
      required: true,
    },
    dateOfVisits: [{ type: Date }],
    diagnosis: { type: String },
    treatment: { type: String },
    notes: { type: String },
    attachments: [String],
  }, // URLs or file paths to attachments
  { timestamps: true },
);

module.exports = mongoose.model("Patient", patientSchema);
