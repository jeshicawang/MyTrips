const { Router } = require('express');

const createUser = (users) => ({ body }, res, next) => {
  return users
    .createUser(body)
    .then(userId => res.json(userId))
    .catch(next)
}

const getIdByUsername = (users) => ({ params }, res, next) => {
  return users
    .getIdByUsername(params.username)
    .then(userId => res.json(userId))
    .catch(next)
}

module.exports = function usersRoutes(users) {
  const router = new Router();
  router.post('/', createUser(users))
  router.get('/:username', getIdByUsername(users))
  return router;
}
