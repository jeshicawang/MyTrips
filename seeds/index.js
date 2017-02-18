exports.seed = (knex) => {
  return knex
    .raw('truncate table users restart identity cascade');
    /* .then(() => {
      return knex
        .insert({ username: 'ron' })
        .into('users')
    }) */
}
