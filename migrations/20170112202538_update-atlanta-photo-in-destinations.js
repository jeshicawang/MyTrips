
exports.up = function(knex, Promise) {
  query = knex('destinations')
    .where('id', 3)
    .update({
      photo_url: 'https://images.unsplash.com/photo-1444852538915-ac95232916dd'
    })
  return query;
};

exports.down = function(knex, Promise) {
  query = knex('destinations')
    .where('id', 3)
    .update({
      photo_url: 'https://images.unsplash.com/photo-1473042904451-00171c69419d'
    })
  return query;
};
