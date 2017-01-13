
exports.up = function(knex, Promise) {
  const query = knex('destinations').insert({
      trip_id: 6,
      location: 'San Diego',
      place_id: 'ChIJSx6SrQ9T2YARed8V_f0hOg0',
      start_date: '2016-12-29',
      end_date: '2017-01-02',
      photo_url: 'https://images.unsplash.com/photo-1444762908691-c8461d64d5f6'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('destinations').max('id');
  const query = knex('destinations').where('id', maxId).del();
  return query;
};
