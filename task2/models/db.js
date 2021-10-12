//  const fs = require('fs');
const nconf = require('nconf');
const path = require('path');

module.exports = function () {
  return nconf.argv().env().file({ file: path.join(__dirname, 'config.json') });
}

// nconf.argv()
// .env()
// .file({ file: './db.json' });


// import low
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')


// const adapter = new FileSync('./models/db.json')
// const db = low(adapter)

// module.exports = db