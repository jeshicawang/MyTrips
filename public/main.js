const currentUser = 2;
const autocompletes = [];
const $trips = document.getElementById('trips');
const $autocompleteMain = document.getElementById('autocomplete');
const $tripList = document.getElementById('trip-list');
const $createTrip = document.getElementById('create-trip')
const $tripForm = document.getElementById('trip-form');
const $userId = document.getElementById('user-id');
const $tripTitle = document.getElementById('trip-title');
const $destinations = document.getElementsByClassName('destination');
const $firstDestination = document.getElementById('0');
const $firstAutocomplete = $firstDestination.getElementsByClassName('autocomplete')[0];
const $addDestination = document.getElementById('add-destination');
//document.getElementById('back').onclick = viewTrips;
document.getElementsByClassName('remove')[0].onclick = removeDestination;
$firstDestination.addEventListener('mouseenter', function () { enableRemove(this) });
$firstDestination.addEventListener('mouseleave', function () { disableRemove(this) });
$addDestination.addEventListener('click', addDestinationToForm);
$tripForm.addEventListener('submit', postTrip);
window.onhashchange = loadPage;

const DEFAULT_HASH = 'trips-upcoming';
window.onload = loadDefaultHash;

function loadDefaultHash() {
  if (!location.hash)
    location.hash = DEFAULT_HASH;
  else
    loadPage();
}

function loadPage() {
  const hash = this.location.hash;
  if (hash === '#trips-upcoming')
    viewTrips('upcoming');
  else if (hash === '#trips-past')
    viewTrips('past');
  else if (hash === '#create-trip')
    viewCreateTrip();
  else
    location.hash = DEFAULT_HASH;
}

function postTrip(event) {
  event.preventDefault();
  const formData = new FormData($tripForm);
  const body = {};
  const destinations = [];
  for (let i = 0; i < $destinations.length; i++)
    destinations.push({});
  ['address', 'location', 'place_id', 'photo_url', 'start_date', 'end_date']
    .forEach(key => formData.getAll(key).forEach((item, index) => destinations[index][key] = item));
  body.user_id = formData.get('user_id');
  body.title = formData.get('title');
  body.description = formData.get('description');
  body.destinations = destinations;
  body.notes = formData.get('notes');
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  fetch('/new-trip', options).then(() => viewTrips());
}

function fetchTrips(type) {
  fetch('/trips/' + currentUser + '/' + type)
    .then(convertToObject)
    .then(displayTrips)
    .catch(logError);
}

function viewTrips(type) {
  const toHide = (type === 'upcoming') ? 'past' : 'upcoming';
  document.getElementById(type).className = 'focus';
  document.getElementById(toHide).className = '';
  empty('trip-list')
  fetchTrips(type);
  $trips.classList.remove('hidden');
  $createTrip.className = 'hidden shadow';
  while(autocompletes.length > 1)
    autocompletes.pop();
}

function viewCreateTrip() {
  empty('trip-list');
  document.getElementById('upcoming').className = '';
  document.getElementById('past').className = '';
  $autocompleteMain.value = '';
  $tripForm.reset();
  $userId.value = currentUser;
  Array.prototype.filter.call($destinations, destination => (destination.id !== '0'))
    .forEach(destination => $tripForm.removeChild(destination));
  $trips.className = 'hidden shadow';
  $createTrip.className = 'shadow';
  if (autocompleteMain.getPlace()) {
    $tripTitle.value = autocompleteMain.getPlace().name + ' Trip';
    $firstAutocomplete.value = autocompleteMain.getPlace().formatted_address;
    updateDestination(autocompleteMain);
  }
}

function removeDestination() {
  if (autocompletes.length === 1) return;
  const $destination = this.parentElement;
  const index = $destination.id;
  autocompletes.splice(index, 1);
  $tripForm.removeChild($destination);
  Array.prototype.filter.call($destinations, destination => (destination.id > index))
    .forEach(destination => destination.id--);
}

function displayTrips(results) {
  results.map(({id, title, description, start_date, end_date, notes, photo_url}) => {
    const tripElement = createElement('div', { id: id, class: 'trip' },
                          createElement('div', { class: 'layer' }, [
                            createElement('h3', { class: 'title' }, title),
                            createElement('p', { class: 'description' }, description ? description : 'no description provided'),
                            createElement('p', { class: 'date' }, start_date + ' - ' + end_date)]));
    tripElement.style.backgroundImage = 'url(' + photo_url + ')';
    return tripElement;
  }).forEach(tripElement => $tripList.appendChild(tripElement));
}

let autocompleteMain;

function initAutocomplete() {
  autocompleteMain = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */($autocompleteMain),
            {types: ['(cities)']}
  );
  autocompleteMain.index = 0;
  autocompleteMain.addListener('place_changed', () => location.hash = 'create-trip');
  autocompletes.push(newAutocomplete(autocompletes.length));
}

function newAutocomplete(index) {
  const autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById(index).getElementsByClassName('autocomplete')[0]),
            {types: ['(cities)']}
  );
  autocomplete.index = index;
  autocomplete.addListener('place_changed', function () { updateDestination(this) });
  return autocomplete;
}

function updateDestination(autocomplete) {
  const place = autocomplete.getPlace();
  const $destination = document.getElementById(autocomplete.index);
  $destination.getElementsByClassName("location")[0].value = place.name;
  $destination.getElementsByClassName("place_id")[0].value = place.place_id;
  $destination.getElementsByClassName("photo_url")[0].value = place.photos[0].getUrl({'maxWidth': 1600});
}

function addDestinationToForm() {
  const index = autocompletes.length;
  const $additionalDestination = createElement('div', { id: index, class: 'destination' }, [
                                   createElement('a', { class: 'remove hidden', href: '#create-trip' }, 'X', ['click', removeDestination]),
                                   createElement('h4', {}, 'Destination'),
                                   createElement('input', { name: 'address', class: 'autocomplete', placeholder: 'Destination', onfocus: 'geolocate()', type: 'text', required: '' }),
                                   createElement('input', { name: 'location', class: 'location', type: 'hidden', required: '' }),
                                   createElement('input', { name: 'place_id', class: 'place_id', type: 'hidden', required: '' }),
                                   createElement('input', { name: 'photo_url', class: 'photo_url', type: 'hidden', required: '' }),
                                   createElement('div', { class: 'dates' }, [
                                     createElement('input', { name: 'start_date', class: 'start', type: 'date', required: '' }),
                                     createElement('input', { name: 'end_date', class: 'end', type: 'date', required: '' })])]);
  $additionalDestination.addEventListener('mouseenter', function () { enableRemove(this) });
  $additionalDestination.addEventListener('mouseleave', function () { disableRemove(this) });
  $tripForm.insertBefore($additionalDestination, $addDestination);
  autocompletes.push(newAutocomplete(index));
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
      autocompleteMain.setBounds(circle.getBounds());
    });
  }
}

function enableRemove(element) {
  element.getElementsByClassName('remove')[0].classList.toggle('hidden');
}

function disableRemove(element) {
  element.getElementsByClassName('remove')[0].classList.toggle('hidden');
}

function convertToObject(results) {
  return results.json();
}

function logError(error) {
  return console.error(error);
}

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
  }).reduce((element, child) => {
    element.appendChild(child);
    return element;
  }, newElement);
}

function empty(id) {
  const element = document.getElementById(id);
  while (element.firstChild)
    element.removeChild(element.firstChild);
}
