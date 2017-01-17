
exports.up = function(knex, Promise) {
  const query = knex('trips').insert({
      user_id: 2,
      title: 'San Francisco Trip',
      description: 'Just visiting.',
      start_date: '2017-01-04',
      end_date: '2017-01-07'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('trips').max('id');
  const query = knex('trips').where('id', maxId).del();
  return query;
};
