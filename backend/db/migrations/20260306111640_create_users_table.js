<<<<<<< HEAD
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 50).notNullable().unique();
    table.string('email', 100).notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('full_name', 100);
    table.text('avatar_url');
    table.enum('role', ['admin', 'staff', 'customer']).defaultTo('customer').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
=======
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // Khóa chính, tự động tăng
    table.string('username', 50).notNullable().unique(); // Tên đăng nhập, không được trùng
    table.string('email', 100).notNullable().unique(); // Email, không được trùng
    table.string('password_hash').notNullable(); // Lưu mật khẩu đã được mã hóa
    table.string('full_name', 100);
    table.text('avatar_url'); // Đường dẫn ảnh đại diện cho chức năng profile
    // Phân quyền hệ thống
    table.enum('role', ['admin', 'staff', 'customer']).defaultTo('customer').notNullable();
    table.timestamps(true, true); // Tự động tạo 2 cột created_at và updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Lệnh dùng để xóa bảng nếu cần rollback lại
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
  return knex.schema.dropTableIfExists('users');
};