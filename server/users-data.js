module.exports = function usersData(knex) {

  return { createUser, getIdByUsername }

  function createUser(user) {
    return knex('users')
      .insert(user)
      .returning('id')
      .then(([id]) => id)
  }

  function getIdByUsername(username) {
    return knex('users')
      .select('id')
      .where('username', username)
      .then(([userId]) => userId);
  }

}
