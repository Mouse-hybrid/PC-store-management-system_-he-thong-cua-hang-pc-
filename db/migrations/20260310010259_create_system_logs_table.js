export const up = function(knex) {
    return knex.schema.createTable('system_logs', (table) => {
      table.increments('id').primary();
      table.string('action', 100);
      table.string('table_name', 50);
      table.integer('record_id');
      table.json('old_data'); // Snapshot trước khi đổi
      table.json('new_data'); // Snapshot sau khi đổi
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('system_logs');
  };