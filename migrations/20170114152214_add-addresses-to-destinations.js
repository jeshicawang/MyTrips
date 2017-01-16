
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw('alter table destinations add column address varchar;'),
    knex('destinations').where('id', 1).update('address', 'Los Angeles, CA, USA'),
    knex('destinations').where('id', 2).update('address', 'Washington, DC, USA'),
    knex('destinations').where('id', 5).update('address', 'San Diego, CA, USA'),
    knex('destinations').where('id', 3).update('address', 'Atlanta, GA, USA'),
    knex('destinations').where('location', 'San Francisco').update('address', 'San Francisco, CA, USA')
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.table('destinations', table => {
    table.dropColumn('address');
  })
};
