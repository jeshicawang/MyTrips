
exports.up = function(knex, Promise) {
  const query = knex('users').insert({username: 'jwang', password: 'qianhui'});
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex('users').where('username', 'jwang').del();
  return query;
};
