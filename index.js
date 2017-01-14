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
const formattedStartDate = knex.raw('to_char(start_date, \'' + dateFormat + '\') as start_date');
const formattedEndDate = knex.raw('to_char(end_date, \'' + dateFormat + '\') as end_date')
const unformattedStartDate = knex.raw('to_date(to_char(start_date, \'' + dateFormat + '\'), \'' + dateFormat + '\')');
const unformattedEndDate = knex.raw('to_date(to_char(end_date, \'' + dateFormat + '\'), \'' + dateFormat + '\')');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/trips/:userId/:upcoming', (req, res) => {
  const upcoming = (req.params.upcoming === 'upcoming');
  const conditional = upcoming ? '>=' : '<';
  const dateType = upcoming ? unformattedStartDate : unformattedEndDate;
  const order = upcoming ? 'asc' : 'desc';
  const query = knex('trips')
    .where('user_id', req.params.userId)
    .andWhere('end_date', conditional, now)
    .orderBy(dateType, order)
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

app.post('/new-trip', (req, res) => {
  console.log(req.body);
  res.json('data sent');
})

app.listen(3000, () => console.log('listening on port 3000'));
