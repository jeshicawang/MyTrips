const express = require('express');
const app = express();

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    user: 'mytrips',
    database: 'mytrips'
  }
});

const now = knex.raw('now()');
const dateFormat = 'Dy, Month DD';
const formattedStartDate = knex.raw('to_char(start_date, \'' + dateFormat + '\') as start_date');
const formattedEndDate = knex.raw('to_char(end_date, \'' + dateFormat + '\') as end_date')
const unformattedStartDate = knex.raw('to_date(to_char(start_date, \'' + dateFormat + '\'), \'' + dateFormat + '\')');

app.use(express.static('public'));

app.get('/trips/:userId/:upcoming', (req, res) => {
  const { userId, upcoming } = req.params;
  const conditional = (upcoming === 'upcoming') ? '>=' : '<';
  const order = (upcoming === 'upcoming') ? 'asc' : 'desc';
  const query = knex('trips')
    .where('user_id', userId)
    .andWhere('end_date', conditional, now)
    .orderBy(unformattedStartDate, order)
    .select('id', 'title', 'description', formattedStartDate, formattedEndDate, 'notes');
  query.then(trips => res.json(trips));
});

app.get('/destinations/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const query = knex('destinations')
    .where('trip_id', tripId)
    .select('id', 'trip_id', 'location', 'place_id', 'start_date', 'end_date', 'photo_url');
  query.then(destinations => res.json(destinations));
});

app.listen(3000, () => console.log('listening on port 3000'));
