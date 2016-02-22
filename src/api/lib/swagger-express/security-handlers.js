import _ from 'lodash';
import httpStatus from 'http-status';

function makeError (code, message) {
  var err = new Error(message || httpStatus[code]);
  err.statusCode = code;
  return err;
}

function oauth2PasswordFlowHandler (authenticate, authorize) {
  return function (request, securityDefinition, scopes, cb) {
    var authorizationHeader = /Bearer (.+)/.exec(request.headers.authorization);

    if (!authorizationHeader) {
      return cb(makeError(httpStatus.UNAUTHORIZED, 'authorization header is missing or in wrong format'));
    }

    authenticate(authorizationHeader[1], function (err, token) {
      if (err) {
        return cb(makeError(httpStatus.UNAUTHORIZED));
      }
      authorize(token, scopes, function (isAuthorized) {
        if (!isAuthorized) {
          return cb(makeError(httpStatus.FORBIDDEN));
        }
        request.token = token;
        cb();
      });
    });
  };
}

function jwtHandler (authenticate, authorize) {
  return function (request, securityDefinition, scopes, cb) {

  }
}

export default function (securityDefinitions, authenticate, authorize) {
  var handlers = {};
  _.each(securityDefinitions, function (securityDefinition, name) {
    if (securityDefinition.type === 'oauth2' && securityDefinition.flow === 'password') {
      handlers[name] = oauth2PasswordFlowHandler(authenticate, authorize);
    } else if (securityDefinition.type === 'jwt') {
      handlers[name] = jwtHandler();
    }
  });
  return handlers;
}
