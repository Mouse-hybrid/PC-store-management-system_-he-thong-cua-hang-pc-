import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.js';

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: "PC Store API Docs"
  }));
};