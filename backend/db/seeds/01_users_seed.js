const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
<<<<<<< HEAD
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('123456', saltRounds);

=======
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // 1. Xóa toàn bộ dữ liệu hiện có trong bảng users để làm sạch
  await knex('users').del();

  // 2. Mã hóa mật khẩu mặc định là '123456'
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('123456', saltRounds);

  // 3. Bơm 3 tài khoản mẫu với 3 role khác nhau
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
  await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@boardgame.com',
      password_hash: hashedPassword,
      full_name: 'Quản trị viên Hệ thống',
<<<<<<< HEAD
      role: 'admin',
      avatar_url: null,
=======
      role: 'admin'
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    },
    {
      username: 'staff',
      email: 'staff@boardgame.com',
      password_hash: hashedPassword,
      full_name: 'Nhân viên Quản lý',
<<<<<<< HEAD
      role: 'staff',
      avatar_url: null,
=======
      role: 'staff'
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    },
    {
      username: 'player1',
      email: 'player1@gmail.com',
      password_hash: hashedPassword,
      full_name: 'Người chơi Cờ Caro',
<<<<<<< HEAD
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
=======
      role: 'customer'
    }
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
  ]);
};