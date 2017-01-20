let currentUser = null;
let loggedIn = false;

const autocompletes = [];
const $homepage = document.getElementById('homepage');
const $existingUser = document.getElementById('existing');
const $newUser = document.getElementById('new');
const $existingUserForm = document.getElementById('existing-user-form');
$existingUserForm.addEventListener('submit', login);
const $newUserForm = document.getElementById('new-user-form');
$newUserForm.addEventListener('submit', newUser);
const $existingUsername = $existingUserForm.getElementsByClassName('username')[0];
const $newUsername = $newUserForm.getElementsByClassName('username')[0];
const $trips = document.getElementById('trips');
$trips.getElementsByClassName('back')[0].onclick = logout;
const $autocompleteMain = document.getElementById('autocomplete');
const $tripList = document.getElementById('trip-list');
const $createTrip = document.getElementById('create-trip')
const $tripForm = document.getElementById('trip-form');
$tripForm.addEventListener('submit', postTrip);
const $userId = document.getElementById('user-id');
const $tripTitle = document.getElementById('trip-title');
const $destinations = document.getElementsByClassName('destination');
const $addDestinationCreate = $tripForm.getElementsByClassName('add-destination')[0];
$addDestinationCreate.addEventListener('click', () => addDestinationToForm('trip-form'));
let $modificationForm, $addDestinationModify;
const $modifyTrip = document.getElementById('modify-trip');

window.onload = checkForLogin;

function checkForLogin() {
  loggedIn = (localStorage.getItem('loggedIn') === 'true');
  if (loggedIn) {
    currentUser = localStorage.getItem('userId');
    loadPage();
    return;
  }
  $homepage.classList.remove('hidden');
  location.hash = 'existing-user';
}

window.onhashchange = loadPage;

function loadPage() {
  const hash = this.location.hash;
  if (!loggedIn) {
    if (hash === '#existing-user') {
      $existingUser.classList.add('focus');
      $newUser.classList.remove('focus');
      $existingUserForm.classList.remove('hidden');
      $newUserForm.classList.add('hidden');
    } else if (hash === '#new-user') {
      $newUser.classList.add('focus');
      $existingUser.classList.remove('focus');
      $newUserForm.classList.remove('hidden');
      $existingUserForm.classList.add('hidden');
    } else
      location.hash = 'existing-user';
    return;
  }
  resetEverything();
  if (hash === '#trips-upcoming')
    viewTrips('upcoming');
  else if (hash === '#trips-past')
    viewTrips('past');
  else if (hash === '#create-trip')
    viewCreateTrip();
  else if (hash.substring(0, 13) === '#modify-trip-')
    viewModifyTrip();
  else if (loggedIn)
    location.hash = 'trips-upcoming';
}

function resetEverything() {
  empty('trip-list');
  document.getElementById('upcoming').className = '';
  document.getElementById('past').className = '';
  $autocompleteMain.value = '';
  $tripForm.reset();
  let destinations = Array.prototype.map.call($destinations, destination => destination);
  destinations.forEach(destination => destination.parentElement.removeChild(destination))
  if (document.getElementById('modification-form'))
    $modifyTrip.removeChild(document.getElementById('modification-form'));
  $trips.className = 'hidden shadow';
  $createTrip.className = 'hidden shadow';
  $modifyTrip.className = 'hidden shadow';
  while(autocompletes.length)
    autocompletes.pop();
}

function login(event) {
  event.preventDefault();
  const username = $existingUsername.value;
  $existingUsername.value = '';
  fetch('/users/' + username)
    .then(convertToObject)
    .then(setCurrentUser)
    .catch(() => $existingUserForm.getElementsByClassName('error')[0].style.visibility = 'visible');
}

function newUser() {
  event.preventDefault()
  const username = $newUsername.value;
  $newUsername.value = '';
  const body = { username: username };
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  fetch('/users', options)
    .then(convertToObject)
    .then(id => {
      if (!id) throw new Error('Username is taken.');
      return { id: id };
    })
    .then(setCurrentUser)
    .catch(() => $newUserForm.getElementsByClassName('error')[0].style.visibility = 'visible');
}

function setCurrentUser({id}) {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('userId', id);
  currentUser = id;
  loggedIn = true;
  $homepage.classList.add('hidden');
  location.hash = 'trips-upcoming';
  $existingUserForm.getElementsByClassName('error')[0].style.visibility = 'hidden'
  $newUserForm.getElementsByClassName('error')[0].style.visibility = 'hidden'
}

function logout() {
  localStorage.setItem('loggedIn', 'false');
  loggedIn = false;
  currentUser = null;
  resetEverything();
  $homepage.classList.remove('hidden');
}

function viewTrips(type) {
  document.getElementById(type).className = 'focus';
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (type === 'upcoming'))
    .then(convertToObject)
    .then(displayTrips)
    .catch(logError);
  $trips.classList.remove('hidden');
}

function displayTrips(trips) {
  if (!trips.length) {
    $tripList.appendChild(createElement('div', {  }, 'No trips to display.'));
    return;
  }
  trips.map(trip => createTripElement(trip))
    .forEach(tripElement => $tripList.appendChild(tripElement));
}

function createTripElement(trip) {
  const {id, title, description, start_date, end_date, notes, photo_url} = trip;
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
  fetch('/trips/' + tripId, options).then(() => location.reload());
}

function viewCreateTrip() {
  $createTrip.classList.remove('hidden');
  addDestinationToForm('trip-form')
  const $firstDestination = document.getElementById('0');
  const $firstAutocomplete = $firstDestination.getElementsByClassName('autocomplete')[0];
  if (autocompleteMain.getPlace()) {
    $tripTitle.value = autocompleteMain.getPlace().name + ' Trip';
    $firstAutocomplete.value = autocompleteMain.getPlace().formatted_address;
    updateDestination(autocompleteMain);
  }
}

function postTrip(event) {
  event.preventDefault();
  const body = toObject($tripForm);
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  fetch('/trips?userId=' + currentUser, options).then(() => location.hash = 'trips-upcoming');
}

function viewModifyTrip() {
  $modifyTrip.classList.remove('hidden');
  fetch('/trips/' + location.hash.substring(13))
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
                        createElement('input', { class: 'submit', type: 'submit', value: 'Done' })];
  destinations.forEach(({ id, address, location, place_id, photo_url, start_date, end_date }, index) => {
    formElements.splice(formElements.length-3, 0, createDestinationElement(index, address, location, place_id, photo_url, start_date, end_date));
  })
  return createElement('form', { id: 'modification-form' }, formElements, ['submit', putTrip]);
}

function putTrip(event) {
  event.preventDefault();
  const body = toObject($modificationForm);
  const options = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  const tripId = location.hash.substring(13);
  fetch('/trips/' + tripId, options).then(() => location.hash = 'trips-upcoming');
}

function toObject(formElement) {
  const formData = new FormData(formElement);
  const body = {};
  const destinations = [];
  for (let i = 0; i < $destinations.length; i++)
    destinations.push({});
  ['address', 'location', 'place_id', 'photo_url', 'start_date', 'end_date']
    .forEach(key => formData.getAll(key).forEach((item, index) => destinations[index][key] = item));
  const dates = destinations.reduce((dates, destination) => {
    dates.push(destination.start_date);
    dates.push(destination.end_date);
    return dates;
  }, []).sort();
  body.title = formData.get('title');
  body.description = formData.get('description');
  body.start_date = dates[0];
  body.end_date = dates[dates.length-1];
  body.destinations = destinations;
  body.notes = formData.get('notes');
  return body;
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

function removeDestination() {
  if (autocompletes.length === 1) return;
  const $destination = this.parentElement;
  const index = $destination.id;
  autocompletes.splice(index, 1);
  $destination.parentElement.removeChild($destination);
  Array.prototype.filter.call($destinations, destination => (destination.id > index))
    .forEach(destination => destination.id--);
}

function enableRemove(element) {
  element.getElementsByClassName('remove')[0].className = 'remove';
}

function disableRemove(element) {
  element.getElementsByClassName('remove')[0].className = 'remove hidden';
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
