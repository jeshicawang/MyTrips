const { Router } = require('express');

const createUser = (db) => (req, res) => {
  const newUser = req.body;
  db('users').insert(newUser).returning('id')
    .then(([userId]) => res.json(userId))
    .catch(() => res.json(0));
}

const getIdByUsername = (db) => (req, res) => {
  const username = req.params.username;
  db('users')
    .select('id')
    .where('username', username)
    .then(([userId]) => res.json(userId));
}

module.exports = function usersRoutes(db) {
  const router = new Router();
  router.post('/', createUser(db))
  router.get('/:username', getIdByUsername(db))
  return router;
}
