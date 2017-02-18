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

  /* describe('create', () => {

    it('create a user', () => {
      const user = { username: 'tim' }

      return users.create(user)
        .then(created => {
          expect(created).to.be.an('object');
          expect(created)
            .to.have.property('id')
            .that.is.a('number')
        })
    });

  }) */

})
