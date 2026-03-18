export const up = function(knex) {
    return knex.schema
      .createTable('orders', (table) => {
<<<<<<< HEAD
        table.increments('order_id').primary(); 
        table.integer('user_id').unsigned()
          .references('user_id').inTable('users')
          .onDelete('SET NULL'); // Giữ lại hóa đơn nếu user bị xóa
        table.string('guest_name', 100); 
        table.string('guest_phone', 20); 
        table.string('shipping_address', 255).notNullable();
        table.decimal('total_amount', 15, 2).notNullable();
        table.decimal('final_amount', 15, 2); 
        table.enum('status', ['PENDING', 'COMPLETED', 'CANCELLED', 'SHIPPED']).defaultTo('PENDING'); 
=======
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('user_id').inTable('users');
        table.decimal('total_amount', 15, 2).notNullable();
        table.enum('status', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).defaultTo('PENDING');
        table.string('shipping_address', 255).notNullable();
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
        table.timestamps(true, true);
      })
      .createTable('order_details', (table) => {
        table.increments('id').primary();
<<<<<<< HEAD
        table.integer('order_id').unsigned()
          .references('order_id').inTable('orders')
          .onDelete('CASCADE'); // Xóa đơn thì xóa luôn chi tiết
        table.integer('product_id').unsigned().references('pro_id').inTable('products');
        table.string('product_name_at_purchase', 255); 
        table.integer('quantity').notNullable();
        table.decimal('price_at_purchase', 15, 2).notNullable(); 
        table.decimal('total_line_price', 15, 2); 
      });
  };
  
export const down = function(knex) {
    // CỰC KỲ QUAN TRỌNG: Phải xóa bảng CON (details) trước bảng CHA (orders)
    return knex.schema
      .dropTableIfExists('order_details')
      .dropTableIfExists('orders');
};
=======
        table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
        table.integer('product_id').unsigned().references('pro_id').inTable('products');
        table.integer('quantity').notNullable();
        table.decimal('unit_price', 15, 2).notNullable(); // Lưu giá tại thời điểm mua
      });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('order_details').dropTable('orders');
  };
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
