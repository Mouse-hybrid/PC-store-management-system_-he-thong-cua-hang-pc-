import knex from 'knex';
import knexConfig from '../knexfile.js';

const env = process.env.NODE_ENV || 'development';

// chọn đúng config theo NODE_ENV
const db = knex(knexConfig[env]);

export const initializeSqlLogic = async () => {
    console.log("Đã chạy initializeSqlLogic!");
};

export default db;