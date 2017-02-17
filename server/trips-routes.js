const { Router } = require('express');

const getTrips = (db) => (req, res) => {
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
}

const createTrip = (db) => (req, res) => {
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
}

const getTripById = (db) => (req, res) => {
  const tripId = req.params.tripId;
  const rawStartDate = db.raw('to_char(destinations.start_date, \'YYYY-MM-DD\') as start_date');
  const rawEndDate = db.raw('to_char(destinations.end_date, \'YYYY-MM-DD\') as end_date');
  db('trips')
    .join('destinations', 'trips.id', '=', 'destinations.trip_id')
    .where('trips.id', tripId)
    .orderBy('destinations.start_date', 'asc')
    .select('title', 'description', 'notes', rawStartDate, rawEndDate, 'destinations.id', 'destinations.address', 'location', 'place_id', 'photo_url')
    .then(trip => res.json(trip));
}

const updateTripById = (db) => (req, res) => {
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
    .then(() => db('destinations').where('trip_id', tripId).del())
    .then(() => db('destinations').insert(destinations))
    .then(() => res.sendStatus(200));
}

const deleteTripById = (db) => (req,res) => {
  const tripId = req.params.tripId;
  db('trips').where('id', tripId).del()
    .then(() => res.sendStatus(204));
}

module.exports = function tripsRoutes(db) {
  const router = new Router();
  router.get('/', getTrips(db));
  router.post('/', createTrip(db));
  router.get('/:tripId', getTripById(db));
  router.put('/:tripId', updateTripById(db));
  router.delete('/:tripId', deleteTripById(db));
  return router;
}
