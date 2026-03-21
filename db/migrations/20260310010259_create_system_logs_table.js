export const up = function(knex) {
    return knex.schema.createTable('system_logs', (table) => {
      table.increments('id').primary();
      table.string('action_type', 100); // Đổi từ action thành action_type cho khớp SQL
      table.string('table_name', 50);
      table.integer('related_id');     // Đổi từ record_id thành related_id cho khớp SQL
      table.text('message');           // Đổi từ content thành message cho khớp SQL
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

export const down = function(knex) {
    return knex.schema.dropTableIfExists('system_logs');
};
