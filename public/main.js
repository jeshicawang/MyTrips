const currentUser = 2;

const tripsContainer = document.getElementById('trips');

fetch('/trips/' + currentUser)
  .then(convertToObject)
  .then(displayTrips)
  .catch(logError);

function convertToObject(results) {
  return results.json();
}

function displayTrips(results) {
  results.map(({id, title, description, start_date, end_date, notes}) =>
    createElement('div', { id: id, class: 'trip' },
      createElement('div', { class: 'layer' }, [
        createElement('h2', { class: 'title' }, title),
        createElement('p', { class: 'description' }, description ? description : 'no description provided'),
        createElement('p', { class: 'date' }, start_date + ' - ' + end_date)]))
  ).forEach(tripElement => {
    tripsContainer.appendChild(tripElement);
    fetch('/destinations/' + tripElement.id)
      .then(convertToObject)
      .then(setDestinationPhoto)
      .catch(logError);
  });
}

function setDestinationPhoto([{trip_id, photo_url}]) {
  document.getElementById(trip_id).style.backgroundImage = 'url(' + photo_url + ')';
}

function logError(error) {
  return console.error(error);
}

// Returns a new element w/ the given tag, attrubutes, children, & eventListener
function createElement(tag, attributes, children, eventListener) {
  const newElement = document.createElement(tag);
  for (const key in attributes) {
    newElement.setAttribute(key, attributes[key]);
  }
  if (eventListener)
    newElement.addEventListener(eventListener[0], eventListener[1]);
  if (!children && children !== 0) return newElement;
  if (!(children instanceof Array))
    children = [children];
  return children.reduce( (children, child) => {
    return children.concat(child);
  },[]).map( child => {
    if (!(child instanceof Element))
      child = document.createTextNode(child);
    return child;
  }).reduce( (element, child) => {
    element.appendChild(child);
    return element;
  }, newElement);
}
