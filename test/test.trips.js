/* global describe, it, beforeEach, afterEach */

const moment = require('moment');
const { expect, begin } = require('./__test__.js');
const tripsData = require('../server/trips-data.js');

describe('tripsData', () => {
  let trx
  let trips;

  beforeEach(begin(_trx => {
    trx = _trx;
    trips = tripsData(trx);
  }))

  afterEach(() => trx.rollback());

  it('is an object', () => {
    expect(trips).to.be.an('object');
  })

  describe('getTrips', () => {

    it('if upcoming-filter is true, gets upcoming trips of the given user', () => {
      return trips.getTrips(1, true).then(trips => {
        expect(trips).to.be.an('array');
        trips.forEach(trip => {
          expect(trip).to.be.an('object')
          expect(trip).to.have.all.keys('id', 'title', 'description', 'start_date', 'end_date', 'notes', 'photo_url');
          const filterPassing = moment(trip.end_date, 'ddd, MMMM DD, YYYY').isSameOrAfter();
          expect(filterPassing).to.be.true;
        })
      })
    });

    it('if upcoming-filter is false, gets past trips of the given user', () => {
      return trips.getTrips(1, false).then(trips => {
        expect(trips).to.be.an('array');
        trips.forEach(trip => {
          expect(trip).to.be.an('object')
          expect(trip).to.have.all.keys('id', 'title', 'description', 'start_date', 'end_date', 'notes', 'photo_url');
          const filterPassing = moment(trip.end_date, 'ddd, MMMM DD, YYYY').isBefore();
          expect(filterPassing).to.be.true;
        })
      })
    });

  })

  describe('createTrip', () => {

    it('creates a trip for the given user with the given tripInfo', () => {
      const sampleInfo = {
        title: 'Sample Trip',
        description: 'Just for fun.',
        start_date: '2017-01-04',
        end_date: '2017-01-07',
        notes: 'this is a sample',
        destinations: [{
          location: 'San Francisco',
          place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
          address: 'San Francisco, CA, USA',
          start_date: '2017-01-04',
          end_date: '2016-01-07',
          photo_url: 'https://images.unsplash.com/photo-1422226256160-9b266e308ea6'
        }]
      }
      return trips.createTrip(1, sampleInfo).then(res => {
        expect(res).to.be.ok;
        expect(res.command).to.equal('INSERT');
      })
    })

  })

  describe('getTripById', () => {

    it('gets the trip with the given id', () => {
      return trips.getTripById(1).then(([trip]) => {
        expect(trip).to.be.an('object');
        expect(trip).to.have.all.keys('title', 'description', 'notes', 'start_date', 'end_date', 'id', 'address', 'location', 'place_id', 'photo_url');
        expect(trip.id).to.equal(1);
      })
    })

  })

  describe('updateTripById', () => {

    it('updates the tripInfo of the trip with the given id', () => {
      const sampleInfo = {
        title: 'Sample Trip',
        description: 'Just for fun.',
        start_date: '2017-01-04',
        end_date: '2017-01-07',
        notes: 'this is a sample',
        destinations: [{
          location: 'San Francisco',
          place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
          address: 'San Francisco, CA, USA',
          start_date: '2017-01-04',
          end_date: '2016-01-07',
          photo_url: 'https://images.unsplash.com/photo-1422226256160-9b266e308ea6'
        }]
      }
      return trips.updateTripById(1, sampleInfo).then(res => {
        expect(res).to.be.ok;
        expect(res.command).to.equal('INSERT');
      })
    })

  })

  describe('deleteTripById', () => {

    it('deletes the trip with the given id', () => {
      return trips.deleteTripById(1).then(res => {
        expect(res).to.be.ok;
        expect(res).to.equal(1);
      })
    })

  })

})
