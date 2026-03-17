export const up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    // 1. Cấu trúc cột chính (Khớp hoàn toàn DB pc_store.sql)
    table.increments('pro_id').primary(); //
    table.string('pro_sku', 50).unique(); //
    table.text('pro_name').notNullable(); //
    
    // 2. Khóa ngoại với hành động Set Null khi xóa bảng cha
    table.integer('brand_id').unsigned()
      .references('brand_id').inTable('brands')
      .onDelete('SET NULL'); //
      
    table.integer('category_id').unsigned()
      .references('category_id').inTable('categories')
      .onDelete('SET NULL'); //
    
    table.decimal('pro_price', 15, 2).notNullable().defaultTo(0); //
    table.integer('pro_quantity').notNullable().defaultTo(0); //
    table.string('pro_warranty', 100); //
    table.text('description'); //
    table.timestamp('created_at').defaultTo(knex.fn.now()); //
  })
  .then(() => {
    // 3. Bổ sung Fulltext Index để hỗ trợ Procedure sp_search_product_status
    return knex.raw('ALTER TABLE products ADD FULLTEXT INDEX idx_products_fulltext (pro_name, description)');
  })
  .then(() => {
    // 4. Bổ sung ràng buộc không cho phép tồn kho âm
    return knex.raw('ALTER TABLE products ADD CONSTRAINT check_pro_quantity_positive CHECK (pro_quantity >= 0)'); //
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('products');
};