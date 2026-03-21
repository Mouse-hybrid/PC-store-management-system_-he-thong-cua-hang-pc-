export const up = function(knex) {
  return knex.schema.createTable('reviews', table => {
    table.increments('id').primary();
    
    // 1. Phải có .unsigned() để khớp kiểu dữ liệu
    table.integer('product_id').unsigned().notNullable()
      .references('pro_id').inTable('products').onDelete('CASCADE');
      
    // 2. Phải có .unsigned() và điền ĐÚNG TÊN CỘT của bảng users
    table.integer('user_id').unsigned().notNullable()
      .references('user_id').inTable('users').onDelete('CASCADE');
      
    table.integer('rating').notNullable();
    table.text('comment');
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTableIfExists('reviews');
};