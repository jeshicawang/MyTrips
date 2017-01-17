
exports.up = function(knex, Promise) {
  const query = knex('trips').insert({
      user_id: 2,
      title: 'San Francisco Trip',
      description: 'San Francisco Tango Marathon 2016',
      start_date: '2016-11-11',
      end_date: '2016-11-13'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('trips').max('id');
  const query = knex('trips').where('id', maxId).del();
  return query;
};
