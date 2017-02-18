/* global before, after */

const knex = require('knex');
const { development } = require('../knexfile');
const { expect } = require('chai');

const db = knex(development);

before(() => db.seed.run());

after(() => db.destroy());

// catches errors on rollback, rollback returns a promise
const rejected = promise => promise.catch(err => err);

const begin = setup => done => {
  rejected(db.transaction(trx => {
    setup(trx);
    done();
  }))
}

module.exports = {
  expect,
  begin
}
