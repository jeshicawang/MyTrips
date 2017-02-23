/* global before, after */

const knex = require('knex');
const knexfile = require('../knexfile');
const db = knex(knexfile[process.env.NODE_ENV || 'development']);
const { expect } = require('chai');

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
