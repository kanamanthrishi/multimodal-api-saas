const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
  openapi: "3.0.0",
  info: {
    title: "Movie Recommendation SaaS API",
    version: "1.0.0",
    description: "AI-powered Movie Recommendation API with API Key system",
  },
  servers: [
  {
    url: "https://movie-recommendation-api-za6l.onrender.com",
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
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
},
  apis: [path.join(__dirname, "routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;