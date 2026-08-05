const Joi = require("joi");

// Register User Validation
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.pattern.base":
        "Password must contain at least one special character.",
      "string.empty": "Password is required.",
    }),

  role: Joi.string().trim().valid("doctor", "nurse").required().messages({
    "any.only": "Role must be either doctor or nurse.",
    "string.empty": "Role is required.",
  }),
});

// Login Validation
const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
