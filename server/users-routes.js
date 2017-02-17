const { Router } = require('express');
const router = new Router();
const knex = require('knex')
const knexfile = require('../knexfile.js');
const db = knex(knexfile['development']);

router.get('/:username', (req, res) => {
  const username = req.params.username;
  db('users')
    .select('id')
    .where('username', username)
    .then(([userId]) => res.json(userId));
})

router.post('/', (req, res) => {
  const newUser = req.body;
  db('users').insert(newUser).returning('id')
    .then(([userId]) => res.json(userId))
    .catch(() => res.json(0));
})

module.exports = router;
