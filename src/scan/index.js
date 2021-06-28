const cron = require('node-cron')

module.exports.scan = () => {
  // get project ids from db
  // get them on modrinth
  // check for different updated timestamp
  // filter updated projects
  // set new updated timestamp in db
  // add to queue
  // call
}

module.exports.schedule = cron.schedule('30 * * * *', module.exports.scan(), {
  scheduled: false
});

module.exports.schedule.start();

module.exports.openQueue = () => {
  // 
}