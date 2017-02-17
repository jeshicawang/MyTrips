const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const knex = require('knex')
const knexfile = require('../knexfile.js');
const db = require('knex')(knexfile['development']);

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/users/:username', (req, res) => {
  const username = req.params.username;
  db('users')
    .select('id')
    .where('username', username)
    .then(([userId]) => res.json(userId));
})

app.post('/users', (req, res) => {
  const newUser = req.body;
  db('users').insert(newUser).returning('id')
    .then(([userId]) => res.json(userId))
    .catch(() => res.json(0));
})

app.get('/trips', (req, res) => {
  const upcoming = (req.query.upcoming === 'true');
  const userId = req.query.userId;
  const conditional = upcoming ? '>=' : '<';
  const dateType = upcoming ? 'trips.start_date' : 'trips.end_date';
  const order = upcoming ? 'asc' : 'desc';
  const now = db.raw('current_date');
  const dateFormat = 'Dy, Month DD, YYYY';
  db('trips')
    .join('destinations', 'trips.id', '=', 'destinations.trip_id')
    .distinct(db.raw('on (' + dateType + ') trips.id, title, description, to_char(trips.start_date, \'' + dateFormat + '\') as start_date, to_char(trips.end_date, \'' + dateFormat + '\') as end_date, notes, photo_url'))
    .where('user_id', userId)
    .andWhere('trips.end_date', conditional, now)
    .orderByRaw(dateType + ' ' + order + ', destinations.start_date asc')
    .select()
    .then(trips => res.json(trips));
});

app.get('/trips/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const rawStartDate = db.raw('to_char(destinations.start_date, \'YYYY-MM-DD\') as start_date');
  const rawEndDate = db.raw('to_char(destinations.end_date, \'YYYY-MM-DD\') as end_date');
  db('trips')
    .join('destinations', 'trips.id', '=', 'destinations.trip_id')
    .where('trips.id', tripId)
    .orderBy('destinations.start_date', 'asc')
    .select('title', 'description', 'notes', rawStartDate, rawEndDate, 'destinations.id', 'destinations.address', 'location', 'place_id', 'photo_url')
    .then(trip => res.json(trip));
});

app.post('/trips', (req, res) => {
  const userId = req.query.userId;
  const {title, description, start_date, end_date, destinations, notes} = req.body;
  const trip = {
    user_id: userId,
    title,
    description,
    start_date,
    end_date,
    notes
  };
  db('trips').insert(trip).returning('id')
    .then(([tripId]) => {
      destinations.forEach(destination => destination.trip_id = tripId);
      return db('destinations').insert(destinations)})
    .then(() => res.sendStatus(200));
});

app.put('/trips/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const {title, description, start_date, end_date, destinations, notes} = req.body;
  destinations.forEach(destination => destination.trip_id = tripId);
  const trip = {
    title: title,
    description: description,
    start_date: start_date,
    end_date: end_date,
    notes: notes
  };
  db('trips').update(trip).where('id', tripId)
    .then(() => knex('destinations').where('trip_id', tripId).del())
    .then(() => knex('destinations').insert(destinations))
    .then(() => res.sendStatus(200));
});

app.delete('/trips/:tripId', (req,res) => {
  const tripId = req.params.tripId;
  db('trips').where('id', tripId).del()
    .then(() => res.sendStatus(204));
});

module.exports = app;
