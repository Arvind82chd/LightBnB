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
  const queryString = `SELECT * FROM users WHERE email LIKE $1`;
  const values = [email];
  // return pool
  // .query(queryString, values)
  // .then(results => console.log(results.rows[0]))
  // .catch(err => console.error('query error', err.message))

  return pool
  .query(queryString, values)
  .then(res => res.rows[0])
  .catch(e => console.error(e.stack))

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE users.id = $1`;
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
  RETURNING *`; //for adding this data in database and assigning id
  const values = [`${user.name}`, `${user.email}`, `${user.password}`];
 
  return pool
  .query(queryString, values)
  .then(res => res.rows[0])
  .catch(e => console.error(e.message))
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `SELECT reservations.*, properties.*
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
//  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  return pool
  .query(`SELECT * FROM properties LIMIT $1`, [limit])
  .then(res => res.rows)
  .catch(err => {
    console.error('query error', err.message);
  });

  // const queryString = `SELECT *, $1 FROM properties LIMIT $2`;
  // const values = [`properties.${options}`, limit]
  // return pool
  // .query(queryString, values)
  // .then(res => res.rows)
  // .catch(err => {
  //   console.error('query error', err.message);
  // });

 
 
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
