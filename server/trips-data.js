module.exports = function tripsData(knex) {

  return { getTrips, createTrip, getTripById, updateTripById, deleteTripById }

  function getTrips(userId, upcoming) {
    const conditional = upcoming ? '>=' : '<';
    const dateType = upcoming ? 'alias.start_date' : 'alias.end_date';
    const secondaryDateType = !upcoming ? 'alias.start_date' : 'alias.end_date';
    const order = upcoming ? 'asc' : 'desc';
    const FORMAT = 'Dy, Month DD, YYYY';
    return knex.with('alias', db => {
      db.select()
        .from('trips')
        .join('destinations', 'trips.id', '=', 'destinations.trip_id')
        .distinct(knex.raw('on (trips.id) trips.id, title, description, trips.start_date, trips.end_date, notes, photo_url'))
        .where('user_id', userId)
        .andWhere('trips.end_date', conditional, knex.raw('current_date'))
        .orderByRaw('trips.id asc, destinations.start_date asc')
      })
      .from('alias')
      .select('id', 'title', 'description', knex.raw(`to_char(start_date, \'${FORMAT}\') as start_date`), knex.raw(`to_char(end_date, \'${FORMAT}\') as end_date`), 'notes', 'photo_url')
      .orderByRaw(`${dateType} ${order}, ${secondaryDateType} ${order}`);
  }

  function createTrip(user_id, tripInfo) {
    const { title, description, start_date, end_date, destinations, notes } = tripInfo;
    const trip = { user_id, title, description, start_date, end_date, notes };
    return knex('trips')
      .insert(trip)
      .returning('id')
      .then(([tripId]) => {
        destinations.forEach(destination => destination.trip_id = tripId);
        return knex('destinations')
          .insert(destinations)
          .returning('id')
      })
  }

  function getTripById(tripId) {
    const FORMAT = 'YYYY-MM-DD';
    const rawStartDate = knex.raw(`to_char(destinations.start_date, \'${FORMAT}\') as start_date`);
    const rawEndDate = knex.raw(`to_char(destinations.end_date, \'${FORMAT}\') as end_date`);
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
      .then(() => knex('destinations').insert(destinations).returning('trip_id'))
  }

  function deleteTripById(tripId) {
    return knex('trips').where('id', tripId).del()
  }

}
