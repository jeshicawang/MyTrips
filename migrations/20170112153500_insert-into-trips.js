
exports.up = function(knex, Promise) {
  const query = knex('trips').insert({
      user_id: 2,
      title: 'San Diego New Years Trip',
      description: 'San Diego Tango Festival',
      start_date: '2016-12-29',
      end_date: '2017-01-02'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('trips').max('id');
  const query = knex('trips').where('id', maxId).del();
  return query;
};
