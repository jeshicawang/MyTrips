module.exports = function tripsData(knex) {

  return { getTrips, createTrip, getTripById, updateTripById, deleteTripById }

  function getTrips(userId, upcoming) {
    const conditional = upcoming ? '>=' : '<';
    const dateType = upcoming ? 'trips.start_date' : 'trips.end_date';
    const order = upcoming ? 'asc' : 'desc';
    const now = knex.raw('current_date');
    const dateFormat = 'Dy, Month DD, YYYY';
    return knex('trips')
      .join('destinations', 'trips.id', '=', 'destinations.trip_id')
      .distinct(knex.raw('on (' + dateType + ') trips.id, title, description, to_char(trips.start_date, \'' + dateFormat + '\') as start_date, to_char(trips.end_date, \'' + dateFormat + '\') as end_date, notes, photo_url'))
      .where('user_id', userId)
      .andWhere('trips.end_date', conditional, now)
      .orderByRaw(dateType + ' ' + order + ', destinations.start_date asc')
      .select()
  }

  function createTrip(user_id, tripInfo) {
    const { title, description, start_date, end_date, destinations, notes } = tripInfo;
    const trip = { user_id, title, description, start_date, end_date, notes };
    return knex('trips')
      .insert(trip)
      .returning('id')
      .then(([tripId]) => {
        destinations.forEach(destination => destination.trip_id = tripId);
        return knex('destinations').insert(destinations)})
      .then(() => true);
  }

  function getTripById(tripId) {
    const rawStartDate = knex.raw('to_char(destinations.start_date, \'YYYY-MM-DD\') as start_date');
    const rawEndDate = knex.raw('to_char(destinations.end_date, \'YYYY-MM-DD\') as end_date');
    return knex('trips')
      .join('destinations', 'trips.id', '=', 'destinations.trip_id')
      .where('trips.id', tripId)
      .orderBy('destinations.start_date', 'asc')
      .select('title', 'description', 'notes', rawStartDate, rawEndDate, 'destinations.id', 'destinations.address', 'location', 'place_id', 'photo_url');
  }

  function updateTripById(tripId, tripInfo) {
    const { title, description, start_date, end_date, destinations, notes } = tripInfo;
    destinations.forEach(destination => destination.trip_id = tripId);
    const trip = { title, description, start_date, end_date, notes };
    return knex('trips').update(trip).where('id', tripId)
      .then(() => knex('destinations').where('trip_id', tripId).del())
      .then(() => knex('destinations').insert(destinations))
      .then(() => true);
  }

  function deleteTripById(tripId) {
    return knex('trips').where('id', tripId).del()
      .then(() => true);
  }

}
