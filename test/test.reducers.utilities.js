/* global describe, it */

const { expect } = require('chai');
const { assign, updateItemInArray, newEmptyDestination } = require('../src/reducers/utilities.js');

describe('reducer utilities', () => {

  describe('assign', () => {

    it('creates a new object given an existing object and new values in the form of an object', () => {
      const oldObject = { name: 'jessica', age: 20, favoriteColor: 'red' };
      const newValues = { favoriteColor: 'pink' };
      const result = assign(oldObject, newValues);
      expect(result).to.be.an('object');
      expect(result).to.not.equal(oldObject);
      expect(result).to.have.all.keys('name', 'age', 'favoriteColor');
      expect(result.favoriteColor).to.equal('pink');
    })

  })

  describe('updateItemInArray', () => {

    it('returns a new array with the item at the given index updated with the callback function', () => {
      const array = [1, 2, 3, 4, 5, 6];
      const indexToMatch = 3;
      const updateItemCallback = item => item * 2;
      const result = updateItemInArray(array, indexToMatch, updateItemCallback);
      expect(result).to.be.an('array');
      expect(result).to.not.equal(array);
      expect(result.length).to.equal(array.length);
      result.forEach((result, index) => {
        (index === indexToMatch)
        ? expect(result).to.equal(array[index] * 2)
        : expect(result).to.equal(array[index])
      })
    })

  })

  describe('newEmptyDestination', () => {

    it('returns an empty destination with empty strings assigned to keys', () => {
      const result = newEmptyDestination();
      expect(result).to.be.an('object');
      expect(result).to.have.all.keys('address', 'start_date', 'end_date');
      for (let key in result) {
        expect(result[key]).to.equal('');
      }
    })

  })

})
