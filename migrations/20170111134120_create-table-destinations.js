
exports.up = function(knex, Promise) {
  const query = knex.schema.createTable('destinations', table => {
    table.increments('id');
    table.integer('trip_id');
    table.string('location');
    table.string('place_id');
    table.date('start_date');
    table.date('end_date');
  });
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex.schema.dropTable('destinations');
  return query;
};
