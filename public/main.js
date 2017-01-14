const currentUser = 2;

const autocompletes = [];

const $trips = document.getElementById('trips');
const $autocompleteMain = document.getElementById('autocomplete');
const $tripList = document.getElementById('trip-list');
const $createTrip = document.getElementById('create-trip')
const $tripForm = document.getElementById('trip-form');
const $tripTitle = document.getElementById('trip-title');
const $destinations = document.getElementsByClassName('destination');
const $firstDestination = document.getElementById('0');
const $firstAutocomplete = $firstDestination.getElementsByClassName('autocomplete')[0];
const $addDestination = document.getElementById('add-destination');

let currentlyViewing = 'upcoming';
document.getElementById(currentlyViewing).className = 'focus';
fetchTrips(currentlyViewing);

document.getElementById('upcoming').onclick = switchTripsView;
document.getElementById('past').onclick = switchTripsView;
document.getElementById('back').onclick = viewTrips;
document.getElementsByClassName('remove')[0].onclick = removeDestination;
$firstDestination.addEventListener('mouseenter', function () { enableRemove(this) });
$firstDestination.addEventListener('mouseleave', function () { disableRemove(this) });
$addDestination.addEventListener('click', addDestinationToForm);

function fetchTrips(type) {
  fetch('/trips/' + currentUser + '/' + type)
    .then(convertToObject)
    .then(displayTrips)
    .catch(logError);
}

function switchTripsView() {
  if (currentlyViewing === this.id) return;
  const hidden = (this.id === 'upcoming') ? 'past' : 'upcoming';
  currentlyViewing = this.id;
  this.classList.toggle('focus');
  document.getElementById(hidden).classList.toggle('focus');
  empty('trip-list');
  fetchTrips(this.id);
}

function viewTrips() {
  document.getElementById(currentlyViewing).className = 'focus';
  fetchTrips(currentlyViewing);
  $trips.classList.toggle('hidden');
  $createTrip.classList.toggle('hidden');
  while(autocompletes.length > 1)
    autocompletes.pop();
}

function viewCreateTrip() {
  empty('trip-list');
  document.getElementById(currentlyViewing).className = '';
  $autocompleteMain.value = '';
  $tripForm.reset();
  Array.prototype.filter.call($destinations, destination => (destination.id !== '0'))
  .forEach(destination => $tripForm.removeChild(destination));
  $trips.classList.toggle('hidden');
  $createTrip.classList.toggle('hidden');
  $tripTitle.value = autocompleteMain.getPlace().name + ' Trip';
  $firstAutocomplete.value = autocompleteMain.getPlace().formatted_address;
  updateDestination(autocompleteMain);
}

function removeDestination() {
  if (autocompletes.length === 1) return;
  const $destination = this.parentElement;
  const index = $destination.id;
  autocompletes.splice(index, 1);
  $tripForm.removeChild($destination);
  Array.prototype.filter.call($destinations, destination => (destination.id > index))
  .forEach(destination => {
    destination.id--;
    ['autocomplete', 'location', 'place_id', 'photo_url', 'start', 'end']
    .map(className => destination.getElementsByClassName(className)[0])
    .forEach(element => {
      const name = element.getAttribute('name');
      element.setAttribute('name', name.substring(0, 13) + destination.id + name.substring(14));
    });
  });
}

function displayTrips(results) {
  results.map(({id, title, description, start_date, end_date, notes}) =>
    createElement('div', { id: id, class: 'trip' },
      createElement('div', { class: 'layer' }, [
        createElement('h3', { class: 'title' }, title),
        createElement('p', { class: 'description' }, description ? description : 'no description provided'),
        createElement('p', { class: 'date' }, start_date + ' - ' + end_date)]))
  ).forEach(tripElement => {
    $tripList.appendChild(tripElement);
    fetch('/destinations/' + tripElement.id)
      .then(convertToObject)
      .then(setDestinationPhoto)
      .catch(logError);
  });
}

function setDestinationPhoto([{trip_id, photo_url}]) {
  document.getElementById(trip_id).style.backgroundImage = 'url(' + photo_url + ')';
}

let autocompleteMain;

function initAutocomplete() {
  autocompleteMain = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */($autocompleteMain),
            {types: ['(cities)']}
  );
  autocompleteMain.index = 0;
  autocompleteMain.addListener('place_changed', viewCreateTrip);
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
                                   createElement('a', { class: 'remove hidden', href: '#' }, 'X', ['click', removeDestination]),
                                   createElement('h4', {}, 'Destination'),
                                   createElement('input', { name: 'destinations[' + index + '][address]', class: 'autocomplete', placeholder: 'Destination', onfocus: 'geolocate()', type: 'text', required: '' }),
                                   createElement('input', { name: 'destinations[' + index + '][location]', class: 'location', type: 'hidden', required: '' }),
                                   createElement('input', { name: 'destinations[' + index + '][place_id]', class: 'place_id', type: 'hidden', required: '' }),
                                   createElement('input', { name: 'destinations[' + index + '][photo_url]', class: 'photo_url', type: 'hidden', required: '' }),
                                   createElement('div', { class: 'dates' }, [
                                     createElement('input', { name: 'destinations[' + index + '][start_date]', class: 'start', type: 'date', required: '' }),
                                     createElement('input', { name: 'destinations[' + index + '][end_date]', class: 'end', type: 'date', required: '' })])]);
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
