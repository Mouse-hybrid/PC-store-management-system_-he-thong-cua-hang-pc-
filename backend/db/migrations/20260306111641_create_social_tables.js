exports.up = async function (knex) {
  await knex.schema.createTable('friend_requests', (table) => {
    table.increments('id').primary();
    table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('receiver_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('status', ['pending', 'accepted', 'rejected']).defaultTo('pending');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('friends', (table) => {
    table.increments('id').primary();
    table.integer('user_one_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('user_two_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['user_one_id', 'user_two_id']);
  });

  await knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('receiver_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('achievements', (table) => {
    table.increments('id').primary();
    table.string('slug').notNullable().unique();
    table.string('title').notNullable();
    table.text('description');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('user_achievements', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('achievement_id').unsigned().notNullable().references('id').inTable('achievements').onDelete('CASCADE');
    table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'achievement_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('user_achievements');
  await knex.schema.dropTableIfExists('achievements');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('friends');
  await knex.schema.dropTableIfExists('friend_requests');
};