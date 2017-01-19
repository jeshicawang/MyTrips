
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => {
      table.dropColumn('password');
    }),
    knex.raw('alter table users add constraint username_unique unique (username);')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => {
      table.string('password');
    }),
    knex('users').where('id', 2).update('password', 'qianhui'),
    knex.raw('alter table users drop constraint username_unique;')
  ]);
};
