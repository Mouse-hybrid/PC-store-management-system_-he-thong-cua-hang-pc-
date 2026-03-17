import swaggerJSDoc from 'swagger-jsdoc';
import components from './components/index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PC Store API Documentation',
      version: '1.0.0',
      description: 'Tài liệu API quản lý linh kiện và đơn hàng PC Store.',
    },
    servers: [
      {
        url: 'https://localhost:3443/api/v1',
        description: 'Server Development (HTTPS)',
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
      schemas: components.schemas,
    },
  },
  // Đường dẫn quét các file Route để tìm chú thích @swagger
  apis: ['./routes/*.js'],
};

export const specs = swaggerJSDoc(options);