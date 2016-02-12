'use strict';

import _ from 'lodash';
import express from 'express';
import cors from 'cors';
import swaggerTools from 'swagger-tools';
import authHandler from 'swagger-magic-auth-handler';
import socialAuthHandler from 'swagger-magic-social-auth-handler';
import securityHandlers from './security-handlers';
import errorHandler from './error-handler';
import { options } from './config';

/**
 *  This module configures an express app with all the swagger magic
 */
export default function init (swaggerObject, callback) {
  swaggerTools.initializeMiddleware(options.swaggerObject, function (swaggerMiddleware) {
    var app = express();
    app.disable('x-powered-by');
    app.use(cors());

    // handle auth
    if (options.swaggerObject.securityDefinitions) {
      if (!options.token || !options.auth) {
        throw new Error('token and auth are required when securityDefinitions is defined');
      }
      var authController = authHandler(options.swaggerObject, options.token, options.auth);
      var socialAuthController = socialAuthHandler(options.swaggerObject, options.token, options.socialAuth);

      options.controllers = options.controllers.controller || {};

      if (authController && !options.useStubs) {
        options.controllers.controller[authController.name] = authController.methods;
      }

      if (socialAuthController) {
        _.forEach(socialAuthController, function (value, key) {
          app.get(key, value);
        });
      }
    }

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(swaggerMiddleware.swaggerMetadata());

    // Secure authenticated resources
    if (swaggerObject.securityDefinitions) {
      app.use(swaggerMiddleware.swaggerSecurity(securityHandlers(swaggerObject.securityDefinitions, options.token.verify, options.auth.authorize)));
    }

    // Validate Swagger requests
    app.use(swaggerMiddleware.swaggerValidator({validateResponse: options.validateResponse}));

    // Route validated requests to appropriate controller
    app.use(swaggerMiddleware.swaggerRouter({
      useStubs: options.useStubs,
      controllers: options.controllers
    }));

    // Serve the Swagger documents and Swagger UI
    app.use(swaggerMiddleware.swaggerUi(options.ui));

    // error handler
    app.use(errorHandler(options.errorConverter));

    callback(app);
  });
}
