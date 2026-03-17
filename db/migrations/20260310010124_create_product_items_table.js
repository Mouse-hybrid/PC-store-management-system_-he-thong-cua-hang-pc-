export const up = function(knex) {
    return knex.schema.createTable('product_items', (table) => {
      table.increments('id').primary();
      table.integer('product_id').unsigned().references('pro_id').inTable('products').onDelete('CASCADE');
      table.string('serial_number', 100).unique().notNullable(); // Số Serial duy nhất
      table.enum('status', ['IN_STOCK', 'SOLD', 'WARRANTY', 'RETURNED']).defaultTo('IN_STOCK');
      table.integer('order_id').unsigned().references('id').inTable('orders').nullable(); // Link tới đơn hàng khi đã bán
      table.timestamps(true, true);
    });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('product_items');
  };