import _ from 'lodash';
import express from 'express';
import cors from 'cors';
import swaggerTools from 'swagger-tools';
import securityHandlers from './security-handlers';
import errorHandler from '../error-handler';
import passport from 'passport';
import auth from '../auth';
import morgan from 'morgan';
import logger from '../logger';
import bodyParser from 'body-parser';

/**
 *  This module configures an express app with all the swagger magic
 */
export default function init (options, callback) {
  swaggerTools.initializeMiddleware(options.swaggerObject, function (swaggerMiddleware) {
    var app = express();
    app.disable('x-powered-by');

    // Configure express logging
    morgan('combined');
    morgan(':remote-addr :method :url :uuid');    // a format string
    morgan(function (req, res) {     // a custom function
      return req.method + ' ' + req.url + ' ' + req.uuid;
    });
    app.use(morgan({ 'stream': logger.stream }));

    app.use(cors());

    app.set('config', options);

    // bodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Initialize passport middleware
    auth(passport, options);
    app.use(passport.initialize());

    // handle auth
    // if (options.swaggerObject.securityDefinitions) {
    //   if (!options.token || !options.auth) {
    //     throw new Error('token and auth are required when securityDefinitions is defined');
    //   }
    //   var authController = authHandler(options.swaggerObject, options.token, options.auth);
    //   var socialAuthController = socialAuthHandler(options.swaggerObject, options.token, options.socialAuth);
    //
    //   options.controllers = options.controllers.controller || {};
    //
    //   if (authController && !options.useStubs) {
    //     options.controllers.controller[authController.name] = authController.methods;
    //   }
    //
    //   if (socialAuthController) {
    //     _.forEach(socialAuthController, function (value, key) {
    //       app.get(key, value);
    //     });
    //   }
    // }

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(swaggerMiddleware.swaggerMetadata());

    // Secure authenticated resources
    if (options.swaggerObject.securityDefinitions) {
      app.use(swaggerMiddleware.swaggerSecurity(securityHandlers(options.swaggerObject.securityDefinitions, options)));
    }

    // Validate Swagger requests
    app.use(swaggerMiddleware.swaggerValidator({validateResponse: options.validateResponse}));

    // Route validated requests to appropriate controller
    app.use(swaggerMiddleware.swaggerRouter({
      useStubs: options.useStubs,
      controllers: options.controllers.controller
    }));

    // Serve the Swagger documents and Swagger UI
    app.use(swaggerMiddleware.swaggerUi(options.ui));

    // error handler
    app.use(errorHandler(options.errorConverter));

    callback(app);
  });
}
