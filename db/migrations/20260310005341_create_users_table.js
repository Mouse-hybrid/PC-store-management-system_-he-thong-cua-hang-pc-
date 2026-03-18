export const up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary(); // Khớp với SQL gốc
    table.string('username', 50).unique().notNullable();
    table.string('password_hash', 255).notNullable(); // Đổi password -> password_hash
    table.string('email', 100).unique().notNullable();
    table.enum('role', ['MEMBER', 'STAFF', 'ADMIN']).defaultTo('MEMBER');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('users');
};