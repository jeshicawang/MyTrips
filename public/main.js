const currentUser = 2;

const tripsContainer = document.getElementById('trip-list');

let currentlyViewing = 'upcoming';
fetchTrips(currentlyViewing);

document.getElementById('upcoming').onclick = toggleTrips;
document.getElementById('past').onclick = toggleTrips;
document.getElementById('back').onclick = switchView;
document.getElementById('trip-form').getElementsByClassName('destination')[0].addEventListener('mouseenter', function () { enableRemove(this) });
document.getElementById('trip-form').getElementsByClassName('destination')[0].addEventListener('mouseleave', function () { disableRemove(this) });

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
        createElement('h3', { class: 'title' }, title),
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

let autocomplete;
const autocompletes = [];
const destinations = [];

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['(cities)']}
  );
  autocomplete.addListener('place_changed', createNewTrip);
  autocompletes.push(newAutocomplete(autocompletes.length));
}

function newAutocomplete(index) {
  const autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('destination' + index).getElementsByClassName('autocomplete')[0]),
            {types: ['(cities)']}
  );
  autocomplete.index = index;
  autocomplete.addListener('place_changed', function () { addDestination(this) });
  return autocomplete;
}

function createNewTrip() {
  switchView();
  const place = autocomplete.getPlace();
  document.getElementById('destination0').getElementsByClassName('autocomplete')[0].value = place.formatted_address;
  destinations.push(place);
  console.log(destinations);
}

function addDestination(autocomplete) {
  const place = autocomplete.getPlace();
  const destinationElement = document.getElementById('destination' + autocomplete.index);
  destinations[autocomplete.index] = place;
  destinationElement.getElementsByClassName("location")[0].value = place.name;
  destinationElement.getElementsByClassName("place_id")[0].value = place.place_id;
  destinationElement.getElementsByClassName("photo_url")[0].value = place.photos[0].getUrl({'maxWidth': 1600});
  console.log(destinations);
}

function switchView() {
  document.getElementById('trip-form').reset();
  document.getElementById('autocomplete').value = '';
  document.getElementById('trips').classList.toggle('hidden');
  document.getElementById('create-trip').classList.toggle('hidden');
  while(autocompletes.length > 1)
    autocompletes.pop();
  while(destinations.length > 0)
    destinations.pop();
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

function enableRemove(element) {
  element.getElementsByClassName('remove')[0].classList.toggle('hidden');
}

function disableRemove(element) {
  element.getElementsByClassName('remove')[0].classList.toggle('hidden');
}
