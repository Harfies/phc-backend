const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PHC API",
      version: "1.0.0",
      description:
        "A secure REST API for managing patient records in a Primary Health Care system. Supports authentication, role-based access, pagination, and file uploads.",
      contact: {
        name: "Afeez Akinsola",
        email: "your@email.com",
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication routes (register, login, users)",
      },
      { name: "Patients", description: "Patient management (CRUD operations)" },
    ],
    servers: [
      {
        url: "https://phc-backend-7l4b.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Patient: {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "number" },
            gender: { type: "string", example: "male" },
            dateOfVisit: { type: "string", format: "date" },
            diagnosis: { type: "string" },
            treatment: { type: "string" },
            notes: { type: "string" },
          },
        },

        User: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["doctor", "nurse"] },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            msg: { type: "string", example: "Error message" },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Operation successful" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
