'use strict';

import { init as swaggerMongoose } from './lib/swagger-mongoose';
import { app } from './lib/swagger-express';
import { log } from './lib/logger';
import { options } from './lib/config';

export default app; // for testing

// initialize express framework - which expects a callback and passes config to it.
app.init(options, (config) => {
  var dboptions = {
    db: config.db,
    swaggerObject: config.swaggerObject,
    models: './src/api/models'
  };

  var db = swaggerMongoose(app, dboptions);

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
