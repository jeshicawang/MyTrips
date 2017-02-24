const assign = (oldObject, newValues) => Object.assign({}, oldObject, newValues);

const updateItemInArray = (array, indexToMatch, updateItemCallback) => (
  array.map((item, index) => (index !== indexToMatch) ? item : updateItemCallback(item))
)

const newEmptyDestination = () => ({ address: '', start_date: '', end_date: '' })

module.exports = { assign, updateItemInArray, newEmptyDestination };
