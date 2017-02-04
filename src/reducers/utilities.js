const updateObject = (oldObject, newValues) => {
  return Object.assign({}, oldObject, newValues);
}

const updateItemInArray = (array, indexToMatch, updateItemCallback) => (
  array.map((item, index) => {
    return (index !== indexToMatch) ? item : updateItemCallback(item)
  })
)

module.exports = { updateObject, updateItemInArray };
