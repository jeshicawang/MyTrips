const currentUser = 2;

const tripsContainer = document.getElementById('trips');

fetch('/trips/' + currentUser)
  .then((results) => results.json())
  .then((results) => {
    results.map(({ id, title, description, start_date, end_date, notes }) => {
      const tripElement = createElement('div', { id: 'trip' + id, class: 'trip' },
                            createElement('div', { class: 'layer' }, [
                              createElement('h2', { class: 'title' }, title),
                              createElement('p', { class: 'description' }, description ? description : 'no description provided'),
                              createElement('p', { class: 'date' }, start_date + ' - ' + end_date)]))
      fetch('/destinations/' + id)
        .then((results) => results.json())
        .then(([firstResult]) => {
          const placeId = firstResult.place_id;
          const request = { placeId: placeId };
          const service = new google.maps.places.PlacesService(new google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8666, lng: 151.1958},
            zoom: 15
          }));
          service.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              const photoUrl = place.photos[0].getUrl({'maxWidth': 1600});
              tripElement.style.backgroundImage = 'url(' + photoUrl + ')';
            }
          });
        })
        .catch((error) => console.error(error));
      return tripElement;
    }).forEach(tripElement => {
      tripsContainer.appendChild(tripElement);
    });
  })
  .catch((error) => console.error(error));

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
