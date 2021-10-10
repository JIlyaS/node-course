//  const fs = require('fs');
const nconf = require('nconf');
const path = require('path');

// nconf.argv()
// .env()
// .file({ file: './db.json' });

nconf.file({ file: path.join(__dirname, 'config.json') });

module.exports = nconf

// import low
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')


// const adapter = new FileSync('./models/db.json')
// const db = low(adapter)

// module.exports = db