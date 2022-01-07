const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');


const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
  port: '5432'
});

//pool.connect().then()

/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `SELECT * FROM users WHERE email LIKE $1;`;
  const values = [email];

  return pool
  .query(queryString, values)
  .then(res => res.rows[0])
  .catch(e => console.error(e.stack))

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE users.id = $1;`;
  const values = [id];
  return pool
  .query(queryString, values)
  .then(res => res.rows[0])
  .catch(e => console.error(e.stack))
  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3) 
  RETURNING *;`; //for adding this data in database and assigning id
  const values = [`${user.name}`, `${user.email}`, `${user.password}`];
 
  return pool
  .query(queryString, values)
  .then(res => res.rows[0])
  .catch(e => console.error(e.message))
 
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  let queryString = `SELECT reservations.*, properties.*
  FROM reservations
  JOIN users ON guest_id = users.id
  JOIN properties
  ON reservations.property_id = properties.id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < Now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2`;

  return pool
  .query(queryString, [guest_id, limit])
  .then(res => res.rows)
  .catch(e => console.error(e.message))

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{city: string, owner_id: number, minimum_price_per_night: number, maximum_price_per_night: number, minimum_rating: number }} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  let queryParams = [];
  let queryString = `SELECT properties.*, AVG(property_reviews.rating) AS average_rating FROM properties
  JOIN property_reviews ON property_id = properties.id `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }

  else if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND WHERE owner_id = $${queryParams.length}`;
  }

  else if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString =+ `AND WHERE cost_per_night > $${queryParams.length}`;
  }

  else if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString =+ `AND WHERE cost_per_night < $${queryParams.length}`;
  }

  else if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString =+ `AND WHERE average_rating >= $${queryParams.length}`;
  } 

  else {
    queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;
  
  console.log(queryString, queryParams);

  return pool
  .query(queryString, queryParams)
  .then(res => res.rows)
  .catch(err => {
    console.error('query error', err.message);
  });
  }

  queryParams.push(limit);
  queryString += ` 
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;
  
  console.log(queryString, queryParams);

  return pool
  .query(queryString, queryParams)
  .then(res => res.rows)
  .catch(err => {
    console.error('query error', err.message);
  });

};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{owner_id: int, title: string, description: string, thumbnail_photo_url: string, cover_photo_url: string, cost_per_night: string, street: string, city: string, province: string, post_code: string, country: string, parking_spaces: int, number_of_bathrooms: int,number_of_bedrooms: int}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  let queryParams = [];
  let queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) `;
  

  if (property.owner_id) {
    queryParams.push(`${property.owner_id}`);
    console.log(queryParams.length)
    queryString += `WHERE properties.owner_id = $${queryParams.length}`;
  }

  else if (property.title) {
    queryParams.push(`${property.title}`);
    queryString += `AND WHERE title = $${queryParams.length}`;
  }

  else if (property.description) {
    queryParams.push(`${property.description}`);
    queryString += `AND WHERE description = $${queryParams.length}`;
  }
  
  else if (property.thumbnail_photo_url) {
    queryParams.push(`${property.thumbnail_photo_url}`);
    queryString += `AND WHERE thumbnail_photo_url = $${queryParams.length}`;
  }

  else if (property.cover_photo_url) {
    queryParams.push(`${property.cover_photo_url}`);
    queryString += `AND WHERE cover_photo_url = $${queryParams.length}`;
  }

  else if (property.cost_per_night) {
    queryParams.push(`${property.cost_per_night}`);
    queryString += `AND WHERE cost_per_night = $${queryParams.length}`;
  }

  else if (property.street) {
    queryParams.push(`${property.street}`);
    queryString += `AND WHERE street = $${queryParams.length}`;
  }

  else if (property.city) {
    queryParams.push(`${property.city}`);
    queryString += `AND WHERE city = $${queryParams.length}`;
  }

  else if (property.province) {
    queryParams.push(`${property.province}`);
    queryString += `AND WHERE province = $${queryParams.length}`;
  }

  else if (property.post_code) {
    queryParams.push(`${property.post_code}`);
    queryString += `AND WHERE post_code = $${queryParams.length}`;
  }

  else if (property.country) {
    queryParams.push(`${property.country}`);
    queryString += `AND WHERE country = $${queryParams.length}`;
  }

  else if (property.parking_spaces) {
    queryParams.push(`${property.parking_spaces}`);
    queryString += `AND WHERE parking_spaces = $${queryParams.length}`;
  }

  else if (property.number_of_bathrooms) {
    queryParams.push(`${property.number_of_bathrooms}`);
    queryString += `AND WHERE number_of_bathrooms = $${queryParams.length}`;
  }

  else if (property.number_of_bedrooms) {
    queryParams.push(`${property.number_of_bedrooms}`);
    queryString += `AND WHERE number_of_bedrooms = $${queryParams.length}`;
  }
  
  
  else {
   
    queryString += ` RETURNING *;`;

    console.log(queryString, queryParams);
    return pool
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(e => console.error(e.message))
  }


  queryString += ` RETURNING *;`;

  console.log(queryString, queryParams);
  return pool
  .query(queryString, queryParams)
  .then(res => res.rows)
  .catch(e => console.error(e.message))

}
exports.addProperty = addProperty;
