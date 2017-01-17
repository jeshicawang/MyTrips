
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw('alter table trips add constraint trips_fkey foreign key (user_id) references users (id) on delete cascade;'),
    knex.raw('alter table destinations add constraint destinations_fkey foreign key (trip_id) references trips (id) on delete cascade;')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw('alter table trips drop constraint if exists trips_fkey;'),
    knex.raw('alter table destinations drop constraint if exists destinations_fkey;')
  ]);
};
