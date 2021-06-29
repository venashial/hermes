const environment = process.env.NODE_ENV || 'production'
const config = require('../../knexfile.js')[environment];
module.exports = require('knex')(config);