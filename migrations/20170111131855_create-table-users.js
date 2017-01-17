
exports.up = function(knex, Promise) {
  const query = knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('username');
    table.string('password');
  });
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex.schema.dropTable('users');
  return query;
};
