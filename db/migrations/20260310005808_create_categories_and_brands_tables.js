export const up = function(knex) {
  return knex.schema
    .createTable('categories', (table) => {
      table.increments('category_id').primary();
<<<<<<< HEAD
      table.string('cat_name', 100).notNullable().unique();
=======
      table.string('name', 100).notNullable().unique();
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
      table.string('description', 255);
      table.timestamps(true, true);
    })

    .createTable('brands', (table) => {
      table.increments('brand_id').primary();
      table.string('brand_name', 100).notNullable().unique();
      table.string('brand_slug', 120).unique().index();
      table.string('logo_url', 255);
      table.timestamps(true, true);
    });
};

export const down = function(knex) {
  return knex.schema
    .dropTable('brands')
    .dropTable('categories');
};