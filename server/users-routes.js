const { Router } = require('express');
const knex = require('knex')
const knexfile = require('../knexfile.js');
const db = knex(knexfile['development']);

const getIdByUsername = (req, res) => {
  const username = req.params.username;
  db('users')
    .select('id')
    .where('username', username)
    .then(([userId]) => res.json(userId));
}

const createUser = (req, res) => {
  const newUser = req.body;
  db('users').insert(newUser).returning('id')
    .then(([userId]) => res.json(userId))
    .catch(() => res.json(0));
}

module.exports = function usersRoutes() {
  const router = new Router();
  router.get('/:username', getIdByUsername)
  router.post('/', createUser)
  return router;
}
