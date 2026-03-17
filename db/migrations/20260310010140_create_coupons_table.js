export const up = function(knex) {
    return knex.schema.createTable('coupons', (table) => {
      table.increments('id').primary();
      table.string('code', 50).unique().notNullable();
      table.enum('type', ['PERCENT', 'FIXED']).defaultTo('FIXED');
      table.decimal('value', 15, 2).notNullable();
      table.decimal('min_order_value', 15, 2).defaultTo(0);
      table.integer('usage_limit').nullable();
      table.integer('used_count').defaultTo(0);
      table.dateTime('expiry_date').notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('coupons');
  };