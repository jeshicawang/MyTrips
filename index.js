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
  const query = knex('trips')
    .where('user_id', userId)
    .select('id', 'title', 'description', 'start_date', 'end_date', 'notes');
  query.then(trips => res.json(trips));
});

app.get('/destinations/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const query = knex('destinations')
    .where('trip_id', tripId)
    .select('id', 'location', 'place_id', 'start_date', 'end_date');
  query.then(destinations => res.json(destinations));
});

app.listen(3000, () => console.log('listening on port 3000'));
