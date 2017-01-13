
exports.up = function(knex, Promise) {
  query = knex('destinations')
    .where('location', 'San Francisco')
    .update({
      photo_url: 'https://images.unsplash.com/photo-1445294812422-0bb9cb94c286'
    })
  return query;
};

exports.down = function(knex, Promise) {
  query = knex('destinations')
    .where('location', 'San Francisco')
    .update({
      photo_url: 'https://images.unsplash.com/photo-1450149632596-3ef25a62011a'
    })
  return query;
};
