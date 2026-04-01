const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('123456', saltRounds);

  await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@boardgame.com',
      password_hash: hashedPassword,
      full_name: 'Quản trị viên Hệ thống',
      role: 'admin',
      avatar_url: null,
    },
    {
      username: 'staff',
      email: 'staff@boardgame.com',
      password_hash: hashedPassword,
      full_name: 'Nhân viên Quản lý',
      role: 'staff',
      avatar_url: null,
    },
    {
      username: 'player1',
      email: 'player1@gmail.com',
      password_hash: hashedPassword,
      full_name: 'Người chơi Cờ Caro',
      role: 'customer',
      avatar_url: null,
    },
    {
      username: 'player2',
      email: 'player2@gmail.com',
      password_hash: hashedPassword,
      full_name: 'Người chơi Rắn săn mồi',
      role: 'customer',
      avatar_url: null,
    },
    {
      username: 'player3',
      email: 'player3@gmail.com',
      password_hash: hashedPassword,
      full_name: 'Người chơi Ghép hình',
      role: 'customer',
      avatar_url: null,
    },
    {
      username: 'player4',
      email: 'player4@gmail.com',
      password_hash: hashedPassword,
      full_name: 'Người chơi Bảng vẽ',
      role: 'customer',
      avatar_url: null,
    },
    {
      username: 'player5',
      email: 'player5@gmail.com',
      password_hash: hashedPassword,
      full_name: 'Người chơi Thành tựu & Ranking',
      role: 'customer',
      avatar_url: null,
     },
  ]);
};