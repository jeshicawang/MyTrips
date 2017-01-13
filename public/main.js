const currentUser = 2;

const tripsContainer = document.getElementById('trip-list');

let currentlyViewing = 'upcoming';
fetchTrips(currentlyViewing);

document.getElementById('upcoming').onclick = toggleTrips;
document.getElementById('past').onclick = toggleTrips;

function fetchTrips(type) {
  fetch('/trips/' + currentUser + '/' + type)
    .then(convertToObject)
    .then(displayTrips)
    .catch(logError);
}

function toggleTrips() {
  if (currentlyViewing === this.id) return;
  const hidden = (this.id === 'upcoming') ? 'past' : 'upcoming';
  currentlyViewing = this.id;
  this.classList.toggle('focus');
  document.getElementById(hidden).classList.toggle('focus');
  empty('trip-list');
  fetchTrips(this.id);
}

function empty(id) {
  const element = document.getElementById(id);
  while (element.firstChild)
    element.removeChild(element.firstChild);
}

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
function createElement(tag, attributes, children) {
  const newElement = document.createElement(tag);
  for (const key in attributes) {
    newElement.setAttribute(key, attributes[key]);
  }
  if (!children && children !== 0) return newElement;
  if (!(children instanceof Array))
    children = [children];
  return children.reduce( (children, child) => {
    return children.concat(child);
  },[]).map( child => {
    if (!(child instanceof Element))
      child = document.createTextNode(child);
    return child;
  }).reduce((element, child) => {
    element.appendChild(child);
    return element;
  }, newElement);
}
