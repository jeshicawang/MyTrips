const addUsers = (knex) => () => knex('users').insert({
  username: 'jessica'
});

const addTrips = (knex) => () => knex('trips').insert([
  { // trip#1
    user_id: 1,
    title: 'Los Angeles Trip',
    description: 'Socal Tango Championship 2017',
    start_date: '2017-02-17',
    end_date: '2017-02-19',
    notes: null
  },
  { // trip#2
    user_id: 1,
    title: 'Washington & New York Trip',
    description: 'Marathon Z and Manhattan!',
    start_date: '2017-03-22',
    end_date: '2017-04-03',
    notes: null
  },
  { // trip#3
    user_id: 1,
    title: 'Atlanta Trip',
    description: 'Atlanta Tango Maraton',
    start_date: '2017-06-02',
    end_date: '2017-06-05',
    notes: null
  },
  { // trip#4
    user_id: 1,
    title: 'Chicago Trip',
    description: 'Chicago Tango Week + Marathon: 10th Edition',
    start_date: '2017-06-30',
    end_date: '2017-07-04',
    notes: null
  },
  { // trip#5
    user_id: 1,
    title: 'San Diego Trip',
    description: 'San Diego Tango Festival',
    start_date: '2016-12-29',
    end_date: '2017-01-02',
    notes: null
  },
  { // trip#6
    user_id: 1,
    title: 'San Francisco Trip',
    description: 'San Francisco Tango Marathon',
    start_date: '2016-11-11',
    end_date: '2016-11-13',
    notes: null
  },
  { // trip#7
    user_id: 1,
    title: 'San Francisco Trip',
    description: 'Just for fun.',
    start_date: '2017-01-04',
    end_date: '2017-01-07',
    notes: null
  },
  { // trip#8
    user_id: 1,
    title: 'Las Vegas Trip',
    description: 'Vegas All-Nighter Weekend',
    start_date: '2016-12-16',
    end_date: '2016-12-18',
    notes: null
  }
])

const addDestinations = (knex) => () => knex('destinations').insert([
  { // destination#1
    trip_id: 1,
    location: 'Los Angeles',
    place_id: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
    address: 'Los Angeles, CA, USA',
    start_date: '2017-02-17',
    end_date: '2017-02-19',
    photo_url: 'https://images.unsplash.com/photo-1480498073050-4c6abeee90c1'
  },
  { // destination#2
    trip_id: 2,
    location: 'Washington',
    place_id: 'ChIJW-T2Wt7Gt4kRKl2I1CJFUsI',
    address: 'Washington, DC, USA',
    start_date: '2017-03-22',
    end_date: '2017-03-27',
    photo_url: 'https://images.unsplash.com/photo-1463839346397-8e9946845e6d'
  },
  { // destination#3
    trip_id: 2,
    location: 'New York',
    place_id: 'ChIJOwg_06VPwokRYv534QaPC8g',
    address: 'New York, NY, USA',
    start_date: '2017-03-27',
    end_date: '2017-04-03',
    photo_url: 'https://images.unsplash.com/photo-1432163230927-a32e4fd5a326'
  },
  { // destination#4
    trip_id: 3,
    location: 'Atlanta',
    place_id: 'ChIJjQmTaV0E9YgRC2MLmS_e_mY',
    address: 'Atlanta, GA, USA',
    start_date: '2017-06-02',
    end_date: '2017-06-05',
    photo_url: 'https://images.unsplash.com/photo-1444852538915-ac95232916dd'
  },
  { // destination#5
    trip_id: 4,
    location: 'Chicago',
    place_id: 'ChIJ7cv00DwsDogRAMDACa2m4K8',
    address: 'Chicago, IL, USA',
    start_date: '2017-06-30',
    end_date: '2017-07-04',
    photo_url: 'https://lh6.googleusercontent.com/-DxDaGYScX40/V7zAHy3j-NI/AAAAAAAABFQ/vkjKo8kMDicfYxjUhrFh8QFwnluQHXUmgCJkC/w1600-k/'
  },
  { // destination#6
    trip_id: 5,
    location: 'San Diego',
    place_id: 'ChIJSx6SrQ9T2YARed8V_f0hOg0',
    address: 'San Diego, CA, USA',
    start_date: '2016-12-29',
    end_date: '2017-01-02',
    photo_url: 'https://images.unsplash.com/photo-1484222618901-c076a34a5a47'
  },
  { // destination#7
    trip_id: 6,
    location: 'San Francisco',
    place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
    address: 'San Francisco, CA, USA',
    start_date: '2016-11-11',
    end_date: '2016-11-13',
    photo_url: 'https://images.unsplash.com/photo-1414005987108-a6d06de8769f'
  },
  { // destination#8
    trip_id: 7,
    location: 'San Francisco',
    place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
    address: 'San Francisco, CA, USA',
    start_date: '2017-01-04',
    end_date: '2016-01-07',
    photo_url: 'https://images.unsplash.com/photo-1471896335371-82fdaca100f2'
  },
  { // destination#9
    trip_id: 8,
    location: 'Las Vegas',
    place_id: 'ChIJ0X31pIK3voARo3mz1ebVzDo',
    address: 'Las Vegas, NV, USA',
    start_date: '2016-12-16',
    end_date: '2016-12-18',
    photo_url: 'https://images.unsplash.com/photo-1483406354872-3e1be6d48c20'
  }
])

exports.seed = (knex) => {
  return knex.raw('truncate table users restart identity cascade')
    .then(addUsers(knex))
    .then(addTrips(knex))
    .then(addDestinations(knex))
}
