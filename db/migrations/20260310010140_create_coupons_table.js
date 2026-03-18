export const up = function(knex) {
    return knex.schema.createTable('coupons', (table) => {
      table.increments('id').primary();
      table.string('code', 50).unique().notNullable();
      table.enum('type', ['PERCENT', 'FIXED']).defaultTo('FIXED');
      table.decimal('value', 15, 2).notNullable();
      table.decimal('min_order_value', 15, 2).defaultTo(0);
<<<<<<< HEAD
      
      // ĐỔI TÊN TẠI ĐÂY: usage_limit -> quantity
      table.integer('quantity').nullable(); 
      
      table.integer('used_count').defaultTo(0);
      table.dateTime('expired_date').notNullable(); // Cột này đã khớp với SQL
=======
      table.integer('usage_limit').nullable();
      table.integer('used_count').defaultTo(0);
      table.dateTime('expiry_date').notNullable();
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
  };
  
<<<<<<< HEAD
export const down = function(knex) {
    return knex.schema.dropTableIfExists('coupons');
};
=======
  export const down = function(knex) {
    return knex.schema.dropTable('coupons');
  };
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
