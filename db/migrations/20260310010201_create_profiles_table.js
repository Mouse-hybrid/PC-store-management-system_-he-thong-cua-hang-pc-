export const up = function(knex) {
  return knex.schema
    .createTable('customer_profiles', (table) => {
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
      table.string('full_name', 100); 
      table.string('phone_number', 20);
      table.string('shipping_address', 255);
      table.integer('loyalty_points').defaultTo(0);
    })
    .createTable('staff_profiles', (table) => {
      table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
      // BỔ SUNG 2 CỘT NÀY CHO NHÂN VIÊN VÀ ADMIN:
      table.string('full_name', 100); 
      table.string('phone_number', 20);
      table.decimal('salary', 15, 2);
      table.timestamp('hire_date').defaultTo(knex.fn.now());
    });
};

export const down = function(knex) {
  return knex.schema.dropTable('staff_profiles').dropTable('customer_profiles');
};