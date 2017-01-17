
exports.up = function(knex, Promise) {
  const query = knex.schema.createTable('trips', table => {
    table.increments('id');
    table.integer('user_id');
    table.string('title');
    table.string('description');
    table.date('start_date');
    table.date('end_date');
    table.string('notes');
  });
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex.schema.dropTable('trips');
  return query;
};
