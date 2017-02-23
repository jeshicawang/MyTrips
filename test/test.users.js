/* global describe, it, beforeEach, afterEach */

const { expect, begin } = require('./__test__.js');
const usersData = require('../server/users-data.js');

describe('userData', () => {
  let trx
  let users;

  beforeEach(begin(_trx => {
    trx = _trx;
    users = usersData(trx);
  }))

  afterEach(() => trx.rollback());

  it('is an object', () => {
    expect(users).to.be.an('object');
  })

  describe('createUser', () => {

    it('creates a new user returning the userId', () => {
      const user = { username: 'tim' }
      return users.createUser(user).then(userId => {
        expect(userId).to.be.a('number');
        expect(userId).to.equal(2);
      })
    });

  })

  describe('getIdByUsername', () => {

    it('returns the userId associated with the given username', () => {
      return users.getIdByUsername('jessica').then(user => {
        expect(user).to.be.an('object');
        expect(user).to.have.property('id').that.is.a('number');
        expect(user.id).to.equal(1);
      })
    })

  })

})
