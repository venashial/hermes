const environment = process.env.USE_POSTGRES ? (JSON.parse(process.env.USE_POSTGRES) == true ? 'production' : 'development') : (process.env.NODE_ENV || 'production')
const config = require('../../knexfile.js')[environment];
module.exports = require('knex')(config);