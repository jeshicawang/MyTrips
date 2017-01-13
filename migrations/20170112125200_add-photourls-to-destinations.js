
exports.up = function(knex, Promise) {
  const query = knex('destinations')
    .where('id', 1)
    .update('photo_url', 'https://images.unsplash.com/photo-1480498073050-4c6abeee90c1');
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex('destinations')
    .where('id', 1)
    .update('photo_url', null);
  return query;
};
