/**
 * init mongoose
 * search on models folder and init it
 *
 * @param app
 * @param config
 * @returns {*} mongoose object
 */

import mongoose from 'mongoose';
import autoload from './loadModels.js';

export function init (app, config) {
  app.set('mongoose', mongoose);
  if (!config) {
    console.log('Error initializing mongo, please set a127 config');
    return;
  }

  if (!config.hasOwnProperty(('db'))) {
    console.log('Error, initizializing mongo, please add params object.db');
  }

  var modelLoaded = autoload.load(mongoose, config, false, app);

  mongoose.connect(config.db);

  mongoose.connection.on('connected', function () {
    console.info('\x1b[32m_______________________________________________________________\x1b[0m');
    console.info(':: Mongo DB - start info log');
    console.log(' ');
    console.info('\x1b[32m*\x1b[0m URL:\x1b[0m' + config.db);

    for (var i = 0; i < modelLoaded.length; i++) {
      console.info('\x1b[32m* \x1b[0mModel: \x1b[35m' + modelLoaded[i] + '\x1b[0m');
    }
    console.info('\x1b[32m_______________________________________________________________\x1b[0m');
    console.info('');
  });

  mongoose.connection.on('error', console.error.bind(console, '\x1b[31m* MONGODB CONNECTION ERROR\x1b[0m'));

  mongoose.connection.on('disconnected', console.error.bind(console, '\x1b[31m* MONGODB DISCONNECTED\x1b[0m'));

  mongoose.connection.on('reconnected', console.error.bind(console, '\x1b[32m* MONGODB RECONNECTED\x1b[0m'));

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });

  return mongoose;
}
