export const up = function(knex) {
    return knex.schema.createTable('system_logs', (table) => {
      table.increments('id').primary();
<<<<<<< HEAD
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
=======
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
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
