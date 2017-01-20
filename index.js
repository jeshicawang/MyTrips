const express = require('express');
const app = express();

const bodyParser = require('body-parser')

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    user: 'mytrips',
    database: 'mytrips'
  }
});

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/users/:username', (req, res) => {
  const username = req.params.username;
  knex('users')
    .select('id')
    .where('username', username)
    .then(([userId]) => res.json(userId));
})

app.post('/users', (req, res) => {
  const newUser = req.body;
  knex('users').insert(newUser).returning('id')
    .then(([userId]) => res.json(userId))
    .catch(error => res.json(0));
})

app.get('/trips/:userId/:upcoming', (req, res) => {
  const upcoming = (req.params.upcoming === 'upcoming');
  const conditional = upcoming ? '>=' : '<';
  const dateType = upcoming ? 'trips.start_date' : 'trips.end_date';
  const order = upcoming ? 'asc' : 'desc';
  const now = knex.raw('now()');
  const dateFormat = 'Dy, Month DD, YYYY';
  knex('trips')
    .join('destinations', 'trips.id', '=', 'destinations.trip_id')
    .distinct(knex.raw('on (' + dateType + ') trips.id, title, description, to_char(trips.start_date, \'' + dateFormat + '\') as start_date, to_char(trips.end_date, \'' + dateFormat + '\') as end_date, notes, photo_url'))
    .where('user_id', req.params.userId)
    .andWhere('trips.end_date', conditional, now)
    .orderByRaw(dateType + ' ' + order + ', destinations.start_date asc')
    .select()
    .then(trips => res.json(trips));
});

app.get('/trip/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const rawStartDate = knex.raw('to_char(destinations.start_date, \'YYYY-MM-DD\') as start_date');
  const rawEndDate = knex.raw('to_char(destinations.end_date, \'YYYY-MM-DD\') as end_date');
  knex('trips')
    .join('destinations', 'trips.id', '=', 'destinations.trip_id')
    .where('trips.id', tripId)
    .orderBy('destinations.start_date', 'asc')
    .select('title', 'description', 'notes', rawStartDate, rawEndDate, 'destinations.id', 'destinations.address', 'location', 'place_id', 'photo_url')
    .then(trip => res.json(trip));
});

app.get('/destinations/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  knex('destinations')
    .where('trip_id', tripId)
    .select('id', 'trip_id', 'location', 'place_id', 'start_date', 'end_date', 'photo_url')
    .then(destinations => res.json(destinations));
});

app.post('/new-trip/:userId', (req, res) => {
  const userId = req.params.userId;
  const {title, description, start_date, end_date, destinations, notes} = req.body;
  const trip = {
    user_id: userId,
    title: title,
    description: description,
    start_date: start_date,
    end_date: end_date,
    notes: notes
  };
  knex('trips').insert(trip).returning('id')
    .then(([tripId]) => {
      destinations.forEach(destination => destination.trip_id = tripId);
      return knex('destinations').insert(destinations)})
    .then(() => res.sendStatus(200));
});

app.put('/modify-trip/:tripId', (req, res) => {
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
  knex('trips').update(trip).where('id', tripId)
    .then(() => knex('destinations').where('trip_id', tripId).del())
    .then(() => knex('destinations').insert(destinations))
    .then(() => res.sendStatus(200));
});

app.delete('/delete-trip/:tripId', (req,res) => {
  const tripId = req.params.tripId;
  knex('trips').where('id', tripId).del()
    .then(() => res.sendStatus(204));
});

app.listen(process.env.PORT, () => console.log('listening on port 3000'));
