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
const $addDestinationCreate = $tripForm.getElementsByClassName('add-destination')[0];
let $modificationForm, $addDestinationModify;
const $modifyTrip = document.getElementById('modify-trip');
$addDestinationCreate.addEventListener('click', () => addDestinationToForm('trip-form'));
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
  else if (hash.substring(0, 13) === '#modify-trip-') {
    viewModifyTrip();
  }
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
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  fetch('/new-trip', options).then(() => location.hash = 'trips-upcoming');
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
  $modifyTrip.className = 'hidden shadow';
  while(autocompletes.length)
    autocompletes.pop();
}

function viewCreateTrip() {
  empty('trip-list');
  document.getElementById('upcoming').className = '';
  document.getElementById('past').className = '';
  $autocompleteMain.value = '';
  $tripForm.reset();
  $userId.value = currentUser;
  let destinations = Array.prototype.map.call($destinations, destination => destination);
  destinations.forEach(destination => destination.parentElement.removeChild(destination))
  if (document.getElementById('modification-form'))
    $modifyTrip.removeChild(document.getElementById('modification-form'));
  $trips.className = 'hidden shadow';
  $createTrip.className = 'shadow';
  addDestinationToForm('trip-form')
  const $firstDestination = document.getElementById('0');
  const $firstAutocomplete = $firstDestination.getElementsByClassName('autocomplete')[0];
  if (autocompleteMain.getPlace()) {
    $tripTitle.value = autocompleteMain.getPlace().name + ' Trip';
    $firstAutocomplete.value = autocompleteMain.getPlace().formatted_address;
    updateDestination(autocompleteMain);
  }
}

function viewModifyTrip() {
  empty('trip-list');
  document.getElementById('upcoming').className = '';
  document.getElementById('past').className = '';
  $autocompleteMain.value = '';
  $trips.className = 'hidden shadow';
  $modifyTrip.className = 'shadow';
  const destinations = Array.prototype.map.call($destinations, destination => destination);
  destinations.forEach(destination => destination.parentElement.removeChild(destination))
  if (document.getElementById('modification-form'))
    $modifyTrip.removeChild(document.getElementById('modification-form'));
  fetch('/trip/' + location.hash.substring(13))
    .then(convertToObject)
    .then(destinations => {
      $modifyTrip.appendChild(createModificationForm(destinations));
      destinations.forEach((destinations, index) => autocompletes.push(newAutocomplete(index)));
      $modificationForm = document.getElementById('modification-form');
      $addDestinationModify = $modificationForm.getElementsByClassName('add-destination')[0];
    })
    .catch(logError);
}

function createModificationForm(destinations) {
  const [{title, description, notes}] = destinations;

  const formElements = [createElement('input', { name: 'title', id: 'trip-title', placeholder: 'Title', type: 'text', required: '', value: title }),
                        createElement('input', { name: 'description', id: 'description', placeholder: 'Description', type: 'text', value: description ? description : '' }),
                        createElement('a', { class: 'add-destination', href: location.hash }, '+ add another destination', ['click', () => addDestinationToForm('modification-form')]),
                        createElement('input', { name: 'notes', id: 'notes', placeholder: 'Notes', type: 'text', value: notes ? notes : '' }),
                        createElement('input', { id: 'done', type: 'submit', value: 'Done' })];

  destinations.forEach(({ id, address, location, place_id, photo_url, start_date, end_date }, index) => {
    formElements.splice(formElements.length-3, 0, createDestinationElement(index, address, location, place_id, photo_url, start_date, end_date));
  })

  return createElement('form', { id: 'modification-form' }, formElements);
}

function removeDestination() {
  if (autocompletes.length === 1) return;
  const $destination = this.parentElement;
  const index = $destination.id;
  autocompletes.splice(index, 1);
  $destination.parentElement.removeChild($destination);
  Array.prototype.filter.call($destinations, destination => (destination.id > index))
    .forEach(destination => destination.id--);
}

function displayTrips(results) {
  results.map(({id, title, description, start_date, end_date, notes, photo_url}) => {
    const tripElement = createElement('div', { id: id, class: 'trip' },
                          createElement('div', { class: 'layer' }, [
                            createElement('span', { class: 'options lnr lnr-chevron-down' }, null, ['click', displayOptions]),
                            createElement('div', { class: 'hidden options shadow' }, [
                              createElement('a', { class: 'options' }, 'modify trip', ['click', modifyTrip]),
                              createElement('a', { class: 'options' }, 'delete trip', ['click', deleteTrip])]),
                            createElement('h3', { class: 'title' }, title),
                            createElement('p', { class: 'description' }, description ? description : 'no description provided'),
                            createElement('p', { class: 'date' }, start_date + ' - ' + end_date)]));
    tripElement.style.backgroundImage = 'url(' + photo_url + ')';
    return tripElement;
  }).forEach(tripElement => $tripList.appendChild(tripElement));
}

let $options = null;

function displayOptions(event) {
  if ($options) return;
  event.stopPropagation();
  const $trip = event.target.parentElement.parentElement;
  $options = $trip.getElementsByClassName('options')[1];
  $options.classList.toggle('hidden');
}

window.onclick = hideOptions;

function hideOptions() {
  if (!$options) return;
  $options.classList.toggle('hidden');
  $options = null;
}

function modifyTrip(event) {
  const tripId = event.target.parentElement.parentElement.parentElement.id;
  location.hash = 'modify-trip-' + tripId;
}

function deleteTrip(event) {
  const tripId = event.target.parentElement.parentElement.parentElement.id;
  const options = { method: 'DELETE' };
  fetch('/delete-trip/' + tripId, options).then(() => location.reload());
}

let autocompleteMain;

function initAutocomplete() {
  autocompleteMain = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */($autocompleteMain),
            {types: ['(cities)']}
  );
  autocompleteMain.index = 0;
  autocompleteMain.addListener('place_changed', () => location.hash = 'create-trip');
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

function addDestinationToForm(formName) {
  const index = autocompletes.length;
  const $additionalDestination = createDestinationElement(index);
  $additionalDestination.addEventListener('mouseenter', function () { enableRemove(this) });
  $additionalDestination.addEventListener('mouseleave', function () { disableRemove(this) });
  const $form = (formName === 'trip-form') ? $tripForm : $modificationForm
  $form.insertBefore($additionalDestination, (formName === 'trip-form') ? $addDestinationCreate : $addDestinationModify);
  autocompletes.push(newAutocomplete(index));
}

function createDestinationElement(index, address, location, place_id, photo_url, start_date, end_date) {
  const destEl = createElement('div', { id: index, class: 'destination' }, [
                   createElement('a', { class: 'remove hidden', href: window.location.hash }, 'X', ['click', removeDestination]),
                   createElement('h4', {}, 'Destination'),
                   createElement('input', { name: 'address', class: 'autocomplete', placeholder: 'Destination', onfocus: 'geolocate()', type: 'text', required: '', value: address ? address : '' }),
                   createElement('input', { name: 'location', class: 'location', type: 'hidden', required: '', value: location ? location : '' }),
                   createElement('input', { name: 'place_id', class: 'place_id', type: 'hidden', required: '', value: place_id ? place_id : '' }),
                   createElement('input', { name: 'photo_url', class: 'photo_url', type: 'hidden', required: '', value: photo_url ? photo_url : '' }),
                   createElement('div', { class: 'dates' }, [
                     createElement('input', { name: 'start_date', class: 'start', type: 'date', required: '', value: start_date ? start_date : '' }),
                     createElement('input', { name: 'end_date', class: 'end', type: 'date', required: '', value: end_date ? end_date : '' })])]);
  destEl.addEventListener('mouseenter', function () { enableRemove(this) });
  destEl.addEventListener('mouseleave', function () { disableRemove(this) });
  return destEl;
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
  element.getElementsByClassName('remove')[0].className = 'remove';
}

function disableRemove(element) {
  element.getElementsByClassName('remove')[0].className = 'remove hidden';
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
