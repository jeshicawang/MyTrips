
exports.up = function(knex, Promise) {
  query = knex('trips')
    .where('id', 3)
    .update({
      title: 'Washington D.C. Trip',
      description: 'Marathon Z'
    })
  return query;
};

exports.down = function(knex, Promise) {
  query = knex('trips')
    .where('id', 3)
    .update({
      title: 'Marathon Z',
      description: null
    })
  return query;
};
