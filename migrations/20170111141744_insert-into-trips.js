
exports.up = function(knex, Promise) {
  const query = knex('trips').insert({
      user_id: 2,
      title: 'SoCal Tango Championship + Festival',
      start_date: '2017-02-17',
      end_date: '2017-02-19'
  });
  return query;
};

exports.down = function(knex, Promise) {
  const maxId = knex('trips').max('id');
  const query = knex('trips').where('id', maxId).del();
  return query;
};
