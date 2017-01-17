
exports.up = function(knex, Promise) {
  const query = knex('destinations').insert({
      trip_id: 2,
      location: 'Los Angeles',
      place_id: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
      start_date: '2017-02-17',
      end_date: '2017-02-19'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('destinations').max('id');
  const query = knex('destinations').where('id', maxId).del();
  return query;
};
