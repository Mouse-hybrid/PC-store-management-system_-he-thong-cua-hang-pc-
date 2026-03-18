export const up = function(knex) {
  return knex.schema
    .createTable('customer_profiles', (table) => {
<<<<<<< HEAD
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
      table.string('full_name', 100); 
      table.string('phone_number', 20);
=======
      // Đảm bảo chỗ này là user_id như đã sửa ở bước trước
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
      table.string('shipping_address', 255);
      table.integer('loyalty_points').defaultTo(0);
    })
    .createTable('staff_profiles', (table) => {
<<<<<<< HEAD
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
      // BỔ SUNG 2 CỘT NÀY CHO NHÂN VIÊN VÀ ADMIN:
      table.string('full_name', 100); 
      table.string('phone_number', 20);
      table.decimal('salary', 15, 2);
=======
      // Đảm bảo chỗ này là user_id như đã sửa ở bước trước
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
      table.decimal('salary', 15, 2);
      
      // SỬA Ở ĐÂY: Đổi từ .date() thành .timestamp()
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
      table.timestamp('hire_date').defaultTo(knex.fn.now());
    });
};

export const down = function(knex) {
  return knex.schema.dropTable('staff_profiles').dropTable('customer_profiles');
};