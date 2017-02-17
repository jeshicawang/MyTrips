const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const knex = require('knex')
const knexfile = require('../knexfile.js');
const db = knex(knexfile['development']);
const usersRoutes = require('./users-routes.js');
const tripsRoutes = require('./trips-routes.js');
const errorHandler = require('./error-handler');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/users', usersRoutes(db));
app.use('/trips', tripsRoutes(db));
app.use(errorHandler);

module.exports = app;
