
exports.up = function(knex, Promise) {
  const query = knex('destinations').insert({
      trip_id: 4,
      location: 'Atlanta',
      place_id: 'ChIJjQmTaV0E9YgRC2MLmS_e_mY',
      start_date: '2017-06-02',
      end_date: '2017-06-04',
      photo_url: 'https://images.unsplash.com/photo-1473042904451-00171c69419d'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('destinations').max('id');
  const query = knex('destinations').where('id', maxId).del();
  return query;
};
