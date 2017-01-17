
exports.up = function(knex, Promise) {
  query = knex('trips')
    .where('id', 2)
    .update({
      title: 'Los Angeles Trip',
      description: 'SoCal Tango Championship + Festival'
    })
  return query;
};

exports.down = function(knex, Promise) {
  query = knex('trips')
    .where('id', 2)
    .update({
      title: 'SoCal Tango Championship + Festival',
      description: null
    })
  return query;
};
