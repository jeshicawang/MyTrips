
exports.up = function(knex, Promise) {
  const query = knex('trips').insert({
      user_id: 2,
      title: 'Atlanta Trip',
      description: 'Atlanta Tango Marathon',
      start_date: '2017-06-02',
      end_date: '2017-06-04'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('trips').max('id');
  const query = knex('trips').where('id', maxId).del();
  return query;
};
