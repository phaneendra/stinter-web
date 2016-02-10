'use strict';

import a127 from 'a127-magic';
import express from 'express';
import { init as swaggerMongoose } from './lib/swagger-mongoose';
import { logger } from './lib/logger';

var log = logger(module);
var app = express();

export default app; // for testing

// initialize a127 framework - which expects a callback and passes config to it.
a127.init((config) => {
  // include a127 middleware
  app.use(a127.middleware(config));

  // error handler to emit errors as a json string
  app.use((err, req, res, next) => {
    console.log(err);
    if (typeof err !== 'object') {
      // If the object is not an Error, create a representation that appears to be
      err = {
        message: String(err) // Coerce to string
      };
    } else {
      // Ensure that err.message is enumerable (It is not by default)
      Object.defineProperty(err, 'message', { enumerable: true });
    }

    // Return a JSON representation of #/definitions/ErrorResponse
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
  });

  var options = {
    db: config.db,
    swaggerObject: config['a127.magic'].swaggerObject,
    models: './src/api/models'
  };

  var db = swaggerMongoose(app, options);

  db.connection.once('open', () => {
    var apiPort = process.env.APIPORT || 10010;
    // begin listening for client requests
    app.listen(apiPort);
    log.info('\x1b[32m_______________________________________________________________\x1b[0m');
    log.info('\x1b[32m*\x1b[0m API is running on port %s', apiPort);
    log.info('\x1b[32m*\x1b[0m Send requests to http://%s:%s', 'localhost', apiPort);
    log.log('\x1b[32m*\x1b[0m Try this: curl http://127.0.0.1:' + apiPort + '/hello?name=Scott');
    log.info('\x1b[32m_______________________________________________________________\x1b[0m');
    log.info('');
  });
});
