
exports.up = function(knex, Promise) {
  const query = knex.raw('alter table destinations add column photo_url varchar;');
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex.schema.table('destinations', table => {
    table.dropColumn('photo_url');
  })
  return query;
};
