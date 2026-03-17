import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    // Sử dụng biến môi trường thay vì text cứng 
    client: process.env.DB_CLIENT || 'mysql2', 
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'pc_store',
      multipleStatements: true, // Cho phép nạp Procedures/Triggers
      charset: 'utf8mb4',
      timezone: 'Z' 
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    pool: {
      min: 2,
      max: 10,
      // Đảm bảo kết nối không bị "treo" khi thực hiện Procedure nặng
      acquireTimeoutMillis: 30000 
    }
  },

  production: {
    client: process.env.DB_CLIENT || 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true, 
      charset: 'utf8mb4',
      timezone: 'Z'
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    pool: {
      min: 2,
      max: 20
    }
  }
};