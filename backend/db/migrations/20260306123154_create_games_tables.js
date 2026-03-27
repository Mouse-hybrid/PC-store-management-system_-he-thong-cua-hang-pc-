/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Bảng lưu danh sách các trò chơi
  await knex.schema.createTable('games', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable(); // Tên game (vd: Caro 5, Rắn săn mồi)
    table.string('slug', 100).notNullable().unique(); // Dùng làm URL (vd: caro-5)
    table.text('instructions'); // Hướng dẫn cách chơi
    table.json('board_size'); // Kích thước bàn game (vd: {"width": 20, "height": 20})
    table.boolean('is_active').defaultTo(true); // Trạng thái enable/disable cho Admin
    table.timestamps(true, true);
  });

  // 2. Bảng lưu trạng thái Save/Load của người chơi
  await knex.schema.createTable('game_saves', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE');
    table.jsonb('state_data').notNullable(); // Lưu toàn bộ ma trận nút bấm dưới dạng JSON
    table.timestamps(true, true);
  });

  // 3. Bảng lưu Điểm số để làm Ranking
  await knex.schema.createTable('game_scores', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE');
    table.integer('score').notNullable().defaultTo(0); // Điểm số
    table.integer('play_time_seconds').notNullable(); // Thời gian chơi (giây)
    table.timestamps(true, true);
  });

  // 4. Bảng Rating và Comment
  await knex.schema.createTable('game_reviews', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE');
    table.integer('rating').notNullable().checkBetween([1, 5]); // Bắt buộc từ 1 đến 5 sao
    table.text('comment');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Khi rollback, phải xóa các bảng phụ trước, bảng chính sau để không lỗi Khóa ngoại
  await knex.schema.dropTableIfExists('game_reviews');
  await knex.schema.dropTableIfExists('game_scores');
  await knex.schema.dropTableIfExists('game_saves');
  await knex.schema.dropTableIfExists('games');
};