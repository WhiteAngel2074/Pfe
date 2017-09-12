'use strict';
const mongoose = require('mongoose');
const config = require('./db');

//
var options = {
    poolSize: 5,
    keepAlive: 300000,
    connectTimeoutMS: 30000,
    useMongoClient: true,
    promiseLibrary: global.Promise,
    keepAlive: 1
};

//
mongoose.Promise = global.Promise;

// Connect To Database
mongoose.connect(config.database, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {console.log('Connected to database ' + config.database)});

conn.on('disconnected', function () {
  console.log('Mongoose default connection to DB :' + config.database + ' disconnected');
});

var gracefulExit = function() {
  conn.close(function () {
    console.log('Mongoose default connection with DB :' + config.database + ' is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

try {
  mongoose.connect(config.database, options);
  console.log("Trying to connect to DB " + config.database);
} catch (err) {
  console.log("Sever initialization failed " , err.message);
}
