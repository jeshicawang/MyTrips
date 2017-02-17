const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const usersRoutes = require('./users-routes.js');
const tripsRoutes = require('./trips-routes.js');
const errorHandler = require('./error-handler');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/users', usersRoutes());
app.use('/trips', tripsRoutes());
app.use(errorHandler);

module.exports = app;
