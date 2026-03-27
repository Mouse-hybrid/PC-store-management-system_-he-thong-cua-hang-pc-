const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // 1. Xóa toàn bộ dữ liệu hiện có trong bảng users để làm sạch
  await knex('users').del();

  // 2. Mã hóa mật khẩu mặc định là '123456'
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('123456', saltRounds);

  // 3. Bơm 3 tài khoản mẫu với 3 role khác nhau
  await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@boardgame.com',
      password_hash: hashedPassword,
      full_name: 'Quản trị viên Hệ thống',
      role: 'admin'
    },
    {
      username: 'staff',
      email: 'staff@boardgame.com',
      password_hash: hashedPassword,
      full_name: 'Nhân viên Quản lý',
      role: 'staff'
    },
    {
      username: 'player1',
      email: 'player1@gmail.com',
      password_hash: hashedPassword,
      full_name: 'Người chơi Cờ Caro',
      role: 'customer'
    }
  ]);
};