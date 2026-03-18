export const up = function(knex) {
    return knex.schema.createTable('refresh_tokens', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('user_id').inTable('users').onDelete('CASCADE');
      table.string('token', 500).notNullable().unique();
      table.dateTime('expires_at').notNullable();
      table.boolean('is_revoked').defaultTo(false);
      table.timestamps(true, true);
    });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('refresh_tokens');
  };