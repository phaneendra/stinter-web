'use strict';

import a127 from 'a127-magic';
import express from 'express';
import db from './lib/swagger-mongoose';

var app = express();

export default app; // for testing

// initialize a127 framework - which expects a callback and passes config to it.
a127.init((config) => {
  // include a127 middleware
  app.use(a127.middleware(config));

  // error handler to emit errors as a json string
  app.use((err, req, res, next) => {
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

  db.connection.once('open', () => {
    console.info('Connected to database: ' + config.db);
    var apiPort = process.env.APIPORT || 10010;
    // begin listening for client requests
    app.listen(apiPort);

    console.info('----\n==> 🌎  API is running on port %s', apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', 'localhost', apiPort);
    console.log('try this:\ncurl http://127.0.0.1:' + apiPort + '/hello?name=Scott');
  });
});
