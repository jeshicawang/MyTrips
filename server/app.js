const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const knex = require('knex')
const knexfile = require('../knexfile.js');
const db = knex(knexfile['development']);
const usersData = require('./users-data.js');
const usersRoutes = require('./users-routes.js');
const tripsData = require('./trips-data.js');
const tripsRoutes = require('./trips-routes.js');
const errorHandler = require('./error-handler');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/users', usersRoutes(usersData(db)));
app.use('/trips', tripsRoutes(tripsData(db)));
app.use(errorHandler);

module.exports = app;
