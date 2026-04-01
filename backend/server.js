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
const db = knex(knexConfig.development);

// =========================
// Basic middleware
// =========================
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép frontend truy cập file ảnh upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================
// Routes
// =========================
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const adminGameRoutes = require('./routes/adminGameRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin/games', adminGameRoutes);

// =========================
// Swagger config
// =========================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boardgame API Documentation',
      version: '1.0.0',
      description: 'Tài liệu hướng dẫn các API cho hệ thống Game Matrix',
    },
    servers: [
      {
        url: `https://localhost:${process.env.HTTPS_PORT || 3636}`,
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
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Đăng ký tài khoản',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    full_name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                  required: ['username', 'email', 'password'],
                },
              },
            },
          },
          responses: {
            '201': { description: 'Đăng ký thành công' },
            '400': { description: 'Dữ liệu không hợp lệ' },
          },
        },
      },

      '/api/auth/login': {
        post: {
          summary: 'Đăng nhập',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Đăng nhập thành công' },
            '401': { description: 'Sai thông tin đăng nhập' },
          },
        },
      },

      '/api/auth/me': {
        get: {
          summary: 'Lấy thông tin người dùng hiện tại',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Thành công' },
            '401': { description: 'Thiếu token' },
          },
        },
      },

      '/api/auth/search': {
        get: {
          summary: 'Tìm kiếm người dùng',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'keyword', schema: { type: 'string' } },
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', example: 10 } },
          ],
          responses: {
            '200': { description: 'Danh sách người dùng' },
          },
        },
      },

      '/api/auth/update-profile': {
        put: {
          summary: 'Cập nhật hồ sơ cá nhân',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    full_name: { type: 'string' },
                    email: { type: 'string' },
                  },
                  required: ['username', 'full_name', 'email'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Cập nhật thành công' },
          },
        },
      },

      '/api/auth/change-password': {
        put: {
          summary: 'Đổi mật khẩu',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    oldPassword: { type: 'string' },
                    newPassword: { type: 'string' },
                  },
                  required: ['oldPassword', 'newPassword'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Đổi mật khẩu thành công' },
          },
        },
      },

      '/api/auth/upload-avatar': {
        post: {
          summary: 'Tải ảnh đại diện',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    avatar: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                  required: ['avatar'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Upload thành công' },
          },
        },
      },

      '/api/auth/users': {
        get: {
          summary: 'Lấy danh sách người dùng (Admin)',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Thành công' },
            '403': { description: 'Không có quyền' },
          },
        },
      },

      '/api/auth/stats': {
        get: {
          summary: 'Lấy thống kê tổng quan (Admin)',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Thành công' },
            '403': { description: 'Không có quyền' },
          },
        },
      },

      '/api/auth/users/{id}': {
        delete: {
          summary: 'Xóa người dùng (Admin)',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Xóa thành công' },
            '403': { description: 'Không có quyền' },
          },
        },
      },

      '/api/game/save': {
        post: {
          summary: 'Lưu trạng thái game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    gameSlug: { type: 'string' },
                    boardState: { type: 'object' },
                    isPlayerTurn: { type: 'boolean' },
                  },
                  required: ['gameSlug'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Lưu thành công' },
          },
        },
      },

      '/api/game/load/{slug}': {
        get: {
          summary: 'Tải trạng thái game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'slug',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Tải thành công' },
            '404': { description: 'Không tìm thấy save' },
          },
        },
      },

      '/api/game/{slug}/help': {
        get: {
          summary: 'Lấy hướng dẫn game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'slug',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
      },

      '/api/game/{slug}/score': {
        post: {
          summary: 'Lưu điểm game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'slug',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    score: { type: 'integer' },
                    play_time_seconds: { type: 'integer' },
                  },
                  required: ['score', 'play_time_seconds'],
                },
              },
            },
          },
          responses: {
            '201': { description: 'Lưu điểm thành công' },
          },
        },
      },

      '/api/game/{slug}/reviews': {
        get: {
          summary: 'Lấy danh sách đánh giá game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'slug',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
        post: {
          summary: 'Gửi đánh giá game',
          tags: ['Game'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'slug',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rating: { type: 'integer', minimum: 1, maximum: 5 },
                    comment: { type: 'string' },
                  },
                  required: ['rating'],
                },
              },
            },
          },
          responses: {
            '201': { description: 'Gửi đánh giá thành công' },
          },
        },
      },

      '/api/friends': {
        get: {
          summary: 'Lấy danh sách bạn bè',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
      },

      '/api/friends/requests': {
        get: {
          summary: 'Lấy danh sách lời mời kết bạn',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
      },

      '/api/friends/request': {
        post: {
          summary: 'Gửi lời mời kết bạn',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    receiver_id: { type: 'integer' },
                  },
                  required: ['receiver_id'],
                },
              },
            },
          },
          responses: {
            '201': { description: 'Gửi lời mời thành công' },
          },
        },
      },

      '/api/friends/request/{id}/accept': {
        put: {
          summary: 'Chấp nhận lời mời kết bạn',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Chấp nhận thành công' },
          },
        },
      },

      '/api/friends/request/{id}/reject': {
        put: {
          summary: 'Từ chối lời mời kết bạn',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Từ chối thành công' },
          },
        },
      },

      '/api/friends/{friendId}': {
        delete: {
          summary: 'Hủy kết bạn',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'friendId',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Hủy kết bạn thành công' },
          },
        },
      },

      '/api/messages/{friendId}': {
        get: {
          summary: 'Lấy hội thoại với một người bạn',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'friendId',
              required: true,
              schema: { type: 'integer' },
            },
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', example: 20 } },
          ],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
      },

      '/api/messages': {
        post: {
          summary: 'Gửi tin nhắn',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    receiver_id: { type: 'integer' },
                    content: { type: 'string' },
                  },
                  required: ['receiver_id', 'content'],
                },
              },
            },
          },
          responses: {
            '201': { description: 'Gửi thành công' },
          },
        },
      },

      '/api/achievements': {
        get: {
          summary: 'Lấy danh sách thành tựu của tôi',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
      },

      '/api/achievements/unlock/{slug}': {
        post: {
          summary: 'Mở khóa thành tựu',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'slug',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Mở khóa thành công' },
          },
        },
      },

      '/api/ranking/{slug}': {
        get: {
          summary: 'Lấy bảng xếp hạng theo game',
          tags: ['Social'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'slug',
              required: true,
              schema: { type: 'string' },
            },
            {
              in: 'query',
              name: 'scope',
              schema: { type: 'string', enum: ['global', 'friends', 'me'] },
            },
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', example: 10 } },
          ],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
      },

      '/api/admin/games': {
        get: {
          summary: 'Lấy danh sách game cho admin',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Thành công' },
          },
        },
      },

      '/api/admin/games/{id}': {
        put: {
          summary: 'Cập nhật game cho admin',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    instructions: { type: 'string' },
                    board_size: { type: 'object' },
                    is_active: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Cập nhật thành công' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Bảo vệ API docs bằng token
app.use('/api-docs', verifyToken, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// =========================
// Health / test route
// =========================
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.raw('SELECT NOW()');
    res.json({
      message: 'Kết nối Database thành công!',
      time: result.rows?.[0] || result[0],
    });
  } catch (error) {
    console.error('Lỗi test DB:', error);
    res.status(500).json({ error: 'Lỗi kết nối Database' });
  }
});

// =========================
// HTTPS server
// =========================
function readTlsOptions() {
  const keyPath = path.resolve(
    process.env.SSL_KEY_PATH || './certs/localhost-key.pem'
  );
  const certPath = path.resolve(
    process.env.SSL_CERT_PATH || './certs/localhost-cert.pem'
  );

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

const HTTPS_PORT = process.env.HTTPS_PORT || 3636;
const httpsServer = https.createServer(readTlsOptions(), app);

async function startServer() {
  try {
    await db.raw('SELECT 1+1 AS result');
    console.log('Database connection established successfully.');

    httpsServer.listen(HTTPS_PORT, () => {
      console.log(`Server đang chạy an toàn tại: https://localhost:${HTTPS_PORT}`);
      console.log(`Frontend được phép gọi từ: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('Lỗi kết nối DB:', error);
  }
}

startServer();