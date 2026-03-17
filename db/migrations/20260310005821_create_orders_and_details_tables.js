export const up = function(knex) {
    return knex.schema
      .createTable('orders', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('user_id').inTable('users');
        table.decimal('total_amount', 15, 2).notNullable();
        table.enum('status', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).defaultTo('PENDING');
        table.string('shipping_address', 255).notNullable();
        table.timestamps(true, true);
      })
      .createTable('order_details', (table) => {
        table.increments('id').primary();
        table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
        table.integer('product_id').unsigned().references('pro_id').inTable('products');
        table.integer('quantity').notNullable();
        table.decimal('unit_price', 15, 2).notNullable(); // Lưu giá tại thời điểm mua
      });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('order_details').dropTable('orders');
  };