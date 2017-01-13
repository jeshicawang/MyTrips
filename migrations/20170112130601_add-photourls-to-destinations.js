
exports.up = function(knex, Promise) {
  const query = knex('destinations')
    .where('id', 2)
    .update('photo_url', 'https://images.unsplash.com/photo-1463839346397-8e9946845e6d');
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex('destinations')
    .where('id', 2)
    .update('photo_url', null);
  return query;
};
