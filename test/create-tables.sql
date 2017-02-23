DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial,
  username varchar UNIQUE NOT NULL
);

DROP TABLE IF EXISTS trips;

CREATE TABLE trips (
  id serial,
  user_id int NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title varchar NOT NULL,
  description varchar,
  start_date date NOT NULL,
  end_date date NOT NULL,
  notes varchar
);

DROP TABLE IF EXISTS destinations;

CREATE TABLE destinations (
  id serial,
  trip_id int NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
  location varchar NOT NULL,
  address varchar NOT NULL,
  place_id varchar NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  photo_url varchar
);
