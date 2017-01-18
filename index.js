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

const now = knex.raw('now()');
const dateFormat = 'Dy, Month DD, YYYY';

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/trips/:userId/:upcoming', (req, res) => {
  const upcoming = (req.params.upcoming === 'upcoming');
  const conditional = upcoming ? '>=' : '<';
  const dateType = upcoming ? 'trips.start_date' : 'trips.end_date';
  const order = upcoming ? 'asc' : 'desc';
  const query = knex('trips')
    .join('destinations', 'trips.id', '=', 'destinations.trip_id')
    .distinct(knex.raw('on (' + dateType + ') trips.id, title, description, to_char(trips.start_date, \'' + dateFormat + '\') as start_date, to_char(trips.end_date, \'' + dateFormat + '\') as end_date, notes, photo_url'))
    .where('user_id', req.params.userId)
    .andWhere('trips.end_date', conditional, now)
    .orderByRaw(dateType + ' ' + order + ', destinations.start_date asc')
    .select();
  query.then(trips => res.json(trips));
});

const rawStartDate = knex.raw('to_char(destinations.start_date, \'YYYY-MM-DD\') as start_date');
const rawEndDate = knex.raw('to_char(destinations.end_date, \'YYYY-MM-DD\') as end_date');

app.get('/trip/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  knex('trips')
    .join('destinations', 'trips.id', '=', 'destinations.trip_id')
    .where('trips.id', tripId)
    .orderBy('destinations.start_date', 'asc')
    .select('title', 'description', 'notes', rawStartDate, rawEndDate, 'destinations.id', 'destinations.address', 'location', 'place_id', 'photo_url')
    .then(trip => res.json(trip));
})

app.get('/destinations/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const query = knex('destinations')
    .where('trip_id', tripId)
    .select('id', 'trip_id', 'location', 'place_id', 'start_date', 'end_date', 'photo_url');
  query.then(destinations => res.json(destinations));
});

app.post('/new-trip', (req, res) => {
  const {user_id, title, description, destinations, notes} = req.body;
  let dates = [];
  destinations.forEach(destination => {
    dates.push(destination.start_date);
    dates.push(destination.end_date);
  });
  dates.sort();
  const trip = {
    user_id: user_id,
    title: title,
    description: description,
    start_date: dates[0],
    end_date: dates[dates.length-1],
    notes: notes
  };
  knex('trips')
    .insert(trip)
    .returning('id')
    .then(([id]) => {
      destinations.forEach(destination => destination.trip_id = id);
      return knex('destinations').insert(destinations);})
    .then(() => res.sendStatus(200));
})

app.delete('/delete-trip/:id', (req,res) => {
  const id = req.params.id;
  knex('trips')
    .where('id', id)
    .del()
    .then(() => res.sendStatus(204));
})

app.listen(process.env.PORT, () => console.log('listening on port 3000'));
