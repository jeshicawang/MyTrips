const { Router } = require('express');

const getTrips = (trips) => ({ query }, res, next) => {
  trips.getTrips(query.userId, (query.upcoming === 'true'))
    .then(trips => res.json(trips))
    .catch(next);
}

const createTrip = (trips) => ({ body, query }, res, next) => {
  trips.createTrip(query.userId, body)
    .then(() => res.sendStatus(200))
    .catch(next);
}

const getTripById = (trips) => ({ params }, res, next) => {
  trips.getTripById(params.tripId)
    .then(trip => res.json(trip))
    .catch(next);
}

const updateTripById = (trips) => ({ params, body }, res, next) => {
  trips.updateTripById(params.tripId, body)
    .then(() => res.sendStatus(200))
    .catch(next);
}

const deleteTripById = (trips) => ({ params }, res, next) => {
  trips.deleteTripById(params.tripId)
    .then(() => res.sendStatus(204))
    .catch(next);
}

module.exports = function tripsRoutes(trips) {
  const router = new Router();
  router.get('/', getTrips(trips));
  router.post('/', createTrip(trips));
  router.get('/:tripId', getTripById(trips));
  router.put('/:tripId', updateTripById(trips));
  router.delete('/:tripId', deleteTripById(trips));
  return router;
}
