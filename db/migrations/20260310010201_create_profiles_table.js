export const up = function(knex) {
  return knex.schema
    .createTable('customer_profiles', (table) => {
      // Đảm bảo chỗ này là user_id như đã sửa ở bước trước
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
      table.string('shipping_address', 255);
      table.integer('loyalty_points').defaultTo(0);
    })
    .createTable('staff_profiles', (table) => {
      // Đảm bảo chỗ này là user_id như đã sửa ở bước trước
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
      table.decimal('salary', 15, 2);
      
      // SỬA Ở ĐÂY: Đổi từ .date() thành .timestamp()
      table.timestamp('hire_date').defaultTo(knex.fn.now());
    });
};

export const down = function(knex) {
  return knex.schema.dropTable('staff_profiles').dropTable('customer_profiles');
};