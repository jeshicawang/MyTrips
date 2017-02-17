const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const usersRoutes = require('./users-routes.js');
const tripsRoutes = require('./trips-routes.js');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/users', usersRoutes());
app.use('/trips', tripsRoutes());

module.exports = app;
