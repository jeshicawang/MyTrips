
exports.up = function(knex, Promise) {
  const query = knex('destinations').insert({
    trip_id: 2,
    location: 'Washington',
    place_id: 'ChIJW-T2Wt7Gt4kRKl2I1CJFUsI',
    start_date: '2017-03-24',
    end_date: '2017-03-26'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('destinations').max('id');
  const query = knex('destinations').where('id', maxId).del();
  return query;
};
