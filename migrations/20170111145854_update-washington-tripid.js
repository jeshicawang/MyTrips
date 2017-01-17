
exports.up = function(knex, Promise) {
  const query = knex('destinations').update('trip_id', 3).where('id', 2);
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex('destinations').update('trip_id', 2).where('id', 2);
  return query;
};
