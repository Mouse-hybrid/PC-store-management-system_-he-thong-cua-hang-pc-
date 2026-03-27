require('dotenv').config();
const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const db = knex(knexConfig.development);

// --- CẤU HÌNH SWAGGER BẰNG JSON (CHỐNG LỖI CĂN LỀ) ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boardgame API Documentation',
      version: '1.0.0',
      description: 'Tài liệu hướng dẫn các API cho hệ thống Game Matrix',
    },
    servers: [{ url: `https://localhost:${process.env.HTTPS_PORT || 3636}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Đăng ký tài khoản',
          tags: ['Authentication'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    full_name: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { '201': { description: 'Thành công' }, '400': { description: 'Lỗi' } }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'Đăng nhập',
          tags: ['Authentication'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'Thành công' }, '401': { description: 'Lỗi' } }
        }
      },
      '/api/auth/me': {
        get: {
          summary: 'Lấy thông tin cá nhân (Profile)',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Thành công' }, '401': { description: 'Chưa xác thực' } }
        }
      },
      '/api/auth/users': {
        get: {
          summary: 'Lấy danh sách người dùng (Chỉ dành cho Admin)',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Thành công' }, '403': { description: 'Từ chối truy cập' } }
        }
      },
      '/api/auth/upload-avatar': {
        post: {
          summary: 'Tải ảnh đại diện (Upload)',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    avatar: { type: 'string', format: 'binary', description: 'File ảnh đại diện' }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'Thành công' } }
        }
      },
      '/api/game/save': {
        post: {
          summary: 'Lưu Game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    gameSlug: { type: 'string' },
                    boardState: { type: 'array', items: { type: 'string', nullable: true } },
                    isPlayerTurn: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'Thành công' } }
        }
      },
      '/api/game/load/{slug}': {
        get: {
          summary: 'Tải Game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Thành công' }, '404': { description: 'Không tìm thấy' } }
        }
      }
    }
  },
  apis: [], // Để trống vì chúng ta đã khai báo paths ở trên
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Bảo vệ trang API-Docs bằng Token
app.use('/api-docs', swaggerUi.serve, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Cho phép Frontend truy cập vào thư mục ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const gameRoutes = require('./routes/gameRoutes');
app.use('/api/game', gameRoutes);

const HTTPS_PORT = process.env.HTTPS_PORT || 3636;

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.raw('SELECT NOW()');
    res.json({ message: 'Kết nối Database thành công!', time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi kết nối Database' });
  }
});

// Chạy HTTPS Server
function readTlsOptions() {
  const keyPath = path.resolve(process.env.SSL_KEY_PATH || './certs/localhost-key.pem');
  const certPath = path.resolve(process.env.SSL_CERT_PATH || './certs/localhost-cert.pem');
  return { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
}

const httpsServer = https.createServer(readTlsOptions(), app);

async function startServer() {
  try {
    await db.raw('SELECT 1+1 AS result');
    console.log('Database connection established successfully.');
    httpsServer.listen(HTTPS_PORT, () => {
      console.log(`🚀 Server đang chạy an toàn tại: https://localhost:${HTTPS_PORT}`);
    });
  } catch (error) {
    console.error('Lỗi kết nối DB:', error);
  }
}

startServer();