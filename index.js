const express = require('express');
const app = express();

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    user: 'mytrips',
    database: 'mytrips'
  }
});

app.use(express.static('public'));

app.get('/trips/:userId', (req, res) => {
  const userId = req.params.userId;
  const dateFormat = 'Dy, Month DD';
  const formattedStartDate = knex.raw('to_char(start_date, \'' + dateFormat + '\') as start_date');
  const formattedEndDate = knex.raw('to_char(end_date, \'' + dateFormat + '\') as end_date')
  const query = knex('trips')
    .where('user_id', userId)
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
