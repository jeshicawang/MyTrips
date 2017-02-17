const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const usersRouter = require('./users-routes.js');
const tripsRouter = require('./trips-routes.js');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/users', usersRouter);
app.use('/trips', tripsRouter);

module.exports = app;
