// Swagger configuration
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PHC API",
      version: "1.0.0",
      description: "Primary Health Care Backend API",
    },
    servers: [
      {
        url: "https://phc-backend-4q48.onrender.com",
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
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // where your docs will be
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
