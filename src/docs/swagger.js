import swaggerJsdoc from 'swagger-jsdoc';
import env from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PEP Project API',
      version: '1.0.0',
      description: 'API documentation for the PEP Project',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
