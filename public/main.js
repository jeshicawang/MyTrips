let currentUser = null;
let loggedIn = false;

const autocompletes = [];

// Homepage Elements
const $homepage = document.getElementById('homepage');
const $existingUser = document.getElementById('existing');
const $newUser = document.getElementById('new');
const $existingUserForm = document.getElementById('existing-user-form');
const $newUserForm = document.getElementById('new-user-form');
const $existingUsername = $existingUserForm.getElementsByClassName('username')[0];
const $newUsername = $newUserForm.getElementsByClassName('username')[0];

// Trips page Elements
const $trips = document.getElementById('trips');
const $upcoming = document.getElementById('upcoming');
const $past = document.getElementById('past');
const $autocompleteMain = document.getElementById('autocomplete');
const $tripList = document.getElementById('trip-list');

// Create Trip page Elements
const $createTrip = document.getElementById('create-trip')
const $tripForm = document.getElementById('trip-form');
const $userId = document.getElementById('user-id');
const $tripTitle = document.getElementById('trip-title');
const $destinations = document.getElementsByClassName('destination');
const $addDestinationCreate = $tripForm.getElementsByClassName('add-destination')[0];

// Modify Trip page Elements & eventListeners
let $modificationForm, $addDestinationModify;
const $modifyTrip = document.getElementById('modify-trip');

window.onload = checkForLogin;
// checks localStorage to see if using is loggedIn
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
// loads a page based on what the current hash url is
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

// returns all elements to their origin state w/out user inputs or modifications
function resetEverything() {
  empty('trip-list');
  $upcoming.className = '';
  $past.className = '';
  $autocompleteMain.value = '';
  $tripForm.reset();
  Array.from($destinations)
    .forEach(destination => destination.parentElement.removeChild(destination))
  if (document.getElementById('modification-form'))
    $modifyTrip.removeChild(document.getElementById('modification-form'));
  $trips.className = 'hidden shadow';
  $createTrip.className = 'hidden shadow';
  $modifyTrip.className = 'hidden shadow';
  while(autocompletes.length)
    autocompletes.pop();
}

$existingUserForm.addEventListener('submit', login);
// GET request for userId associated with the given username, if the username doesn't exist, the error msg is displayed
function login(event) {
  event.preventDefault();
  const username = $existingUsername.value;
  $existingUsername.value = '';
  fetch('/users/' + username)
    .then(convertToObject)
    .then(setCurrentUser)
    .catch(() => $existingUserForm.getElementsByClassName('error')[0].style.visibility = 'visible');
}

$newUserForm.addEventListener('submit', newUser);
// POST request to add a new user, if the username is not unique, the error msg is displayed
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

// assigns currentUser to the given userId and loads the Upcoming Trips page
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

$trips.getElementsByClassName('back')[0].onclick = logout;
// logs out the current user and loads the Homepage
function logout() {
  localStorage.setItem('loggedIn', 'false');
  loggedIn = false;
  currentUser = null;
  resetEverything();
  $homepage.classList.remove('hidden');
}

// Loads Trips page based on type: upcoming or past & GET request for trips of the currentUser
function viewTrips(type) {
  document.getElementById(type).className = 'focus';
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (type === 'upcoming'))
    .then(convertToObject)
    .then(displayTrips)
    .catch(logError);
  $trips.classList.remove('hidden');
}

// maps trip objects to elements and appends them to the 'trip-list' div
function displayTrips(trips) {
  if (!trips.length) {
    $tripList.appendChild(createElement('div', {  }, 'No trips to display.'));
    return;
  }
  trips.map(trip => createTripElement(trip))
    .forEach(tripElement => $tripList.appendChild(tripElement));
}

// returns an element using info from a given trip object.
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
// makes the options pop-up visible
function displayOptions(event) {
  if ($options) return;
  event.stopPropagation();
  const $trip = event.target.parentElement.parentElement;
  $options = $trip.getElementsByClassName('options')[1];
  $options.classList.toggle('hidden');
}

window.onclick = hideOptions;
// hides the options pop-up if there is one visible
function hideOptions() {
  if (!$options) return;
  $options.classList.toggle('hidden');
  $options = null;
}

// called when 'modify trip' is clicked & loads the Modify Trip page
function modifyTrip(event) {
  const tripId = event.target.parentElement.parentElement.parentElement.id;
  location.hash = 'modify-trip-' + tripId;
}

// called when 'delete trip' is clicked, DELETE request to the database for the specified trip, and reloads Trips page
function deleteTrip(event) {
  const tripId = event.target.parentElement.parentElement.parentElement.id;
  const options = { method: 'DELETE' };
  fetch('/trips/' + tripId, options).then(() => location.reload());
}

// loads Create Trip page with information obtained from the main autocomplete object.
function viewCreateTrip() {
  $createTrip.classList.remove('hidden');
  addDestinationToForm('trip-form');
  const $firstDestination = document.getElementById('0');
  const $firstAutocomplete = $firstDestination.getElementsByClassName('autocomplete')[0];
  if (autocompleteMain.getPlace()) {
    $tripTitle.value = autocompleteMain.getPlace().name + ' Trip';
    $firstAutocomplete.value = autocompleteMain.getPlace().formatted_address;
    updateDestination(autocompleteMain);
  }
}

$tripForm.addEventListener('submit', postTrip);
// POST request to add a new trip and it's destinations to the database
function postTrip(event) {
  event.preventDefault();
  const body = toObject($tripForm);
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  fetch('/trips?userId=' + currentUser, options).then(() => location.hash = 'trips-upcoming');
}

// loads Modify Trip page, sends GET request for a trip, and loads the modify-trip form with the returned information
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

// returns a modification form element filled in with information from an array of destinations.
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

// PUT request to update a given trip in the database & reload Trips page
function putTrip(event) {
  event.preventDefault();
  const body = toObject($modificationForm);
  const options = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  const tripId = location.hash.substring(13);
  fetch('/trips/' + tripId, options).then(() => location.hash = 'trips-upcoming');
}

// takes a formElement and returns body object ready to send as POST request to the server.
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

// eventListener
$addDestinationCreate.addEventListener('click', () => addDestinationToForm('trip-form'));
// adds input fields to the given form so that the user can enter an additional destination.
function addDestinationToForm(formName) {
  const index = autocompletes.length;
  const $additionalDestination = createDestinationElement(index);
  $additionalDestination.addEventListener('mouseenter', function () { enableRemove(this) });
  $additionalDestination.addEventListener('mouseleave', function () { disableRemove(this) });
  const $form = (formName === 'trip-form') ? $tripForm : $modificationForm
  $form.insertBefore($additionalDestination, (formName === 'trip-form') ? $addDestinationCreate : $addDestinationModify);
  autocompletes.push(newAutocomplete(index));
}

// returns a destination element that will be appended to a form
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

// Removes the specified destination element from the form.
function removeDestination() {
  if (autocompletes.length === 1) return;
  const $destination = this.parentElement;
  const index = $destination.id;
  autocompletes.splice(index, 1);
  $destination.parentElement.removeChild($destination);
  Array.from($destinations)
    .filter(destination => (destination.id > index))
    .forEach(destination => destination.id--);
}

// shows the remove button when the user hovers over a destination element in the form.
function enableRemove(element) {
  element.getElementsByClassName('remove')[0].classList.remove('hidden');
}

// hides the remove button on mouseleave of a destination element in the form
function disableRemove(element) {
  element.getElementsByClassName('remove')[0].classList.add('hidden');
}

let autocompleteMain;
// initialized the main autocomplete object on the Trips page
function initAutocomplete() {
  autocompleteMain = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */($autocompleteMain),
            {types: ['(cities)']}
  );
  autocompleteMain.index = 0;
  autocompleteMain.addListener('place_changed', () => location.hash = 'create-trip');
}

// initializes a new autocomplete object (for trip elements in the forms)
function newAutocomplete(index) {
  const autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById(index).getElementsByClassName('autocomplete')[0]),
            {types: ['(cities)']}
  );
  autocomplete.index = index;
  autocomplete.addListener('place_changed', function () { updateDestination(this) });
  return autocomplete;
}

// when the user selects a place using the autocomplete, hidden information about the place is written to the form.
function updateDestination(autocomplete) {
  const place = autocomplete.getPlace();
  const $destination = document.getElementById(autocomplete.index);
  $destination.getElementsByClassName("location")[0].value = place.name;
  $destination.getElementsByClassName("place_id")[0].value = place.place_id;
  $destination.getElementsByClassName("photo_url")[0].value = place.photos[0].getUrl({'maxWidth': 1600});
}

// so that autocomplete objects will display cities based off of proximity.
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

// returns an object from json.
function convertToObject(results) {
  return results.json();
}

// logs a given error
function logError(error) {
  return console.error(error);
}

// creates a DOM element with specified tag and optional attributes, children, & eventListener.
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

// emptys the element with the given id
function empty(id) {
  const element = document.getElementById(id);
  while (element.firstChild)
    element.removeChild(element.firstChild);
}
