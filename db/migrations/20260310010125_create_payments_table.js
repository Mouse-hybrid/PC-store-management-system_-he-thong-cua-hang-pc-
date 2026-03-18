export const up = function(knex) {
<<<<<<< HEAD
  return knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().references('order_id').inTable('orders').onDelete('CASCADE');
    table.string('transaction_code', 100).unique(); // Sửa từ transaction_id thành transaction_code
    table.string('method_id', 50);
    table.decimal('amount', 15, 2).notNullable();
    table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).defaultTo('PENDING');
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTableIfExists('payments');
};
=======
    return knex.schema.createTable('payments', (table) => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.string('transaction_id', 100).unique(); // ID từ phía cổng thanh toán
      table.string('method', 50); // MOMO, VNPAY, CASH, BANK
      table.decimal('amount', 15, 2).notNullable();
      table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).defaultTo('PENDING');
      table.timestamps(true, true);
    });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('payments');
  };
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
