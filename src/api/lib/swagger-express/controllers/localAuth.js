// Auth controller that is used to handle
// * /auth/token - called during login flow
// * /auth/invalidate - called during logout flow
//

import httpStatus from 'http-status';
import auth from '../helpers/auth';
import token from '../helpers/token';

function makeError (code, message) {
  var err = new Error(message || httpStatus[code]);
  err.statusCode = code;
  return err;
}

export function getToken (req, res, next) {
  var user = req.swagger.params.user.value;
  auth.authenticate(user.username, user.password, function (err, _user) {
    if (err) {
      return next(makeError(httpStatus.BAD_REQUEST, err.message));
    }
    token.generate(_user, function (err, token) {
      if (err) {
        return next(makeError(httpStatus.INTERNAL_SERVER_ERROR));
      }
      next(null, token);
    });
  });
}

export function invalidateToken (req, res, next) {
  var authToken = req.swagger.params.token.value;
  token.invalidate(authToken, function (err, isOk) {
    if (err) {
      return next(makeError(httpStatus.INTERNAL_SERVER_ERROR));
    }
    if (!isOk) {
      return next(makeError(httpStatus.BAD_REQUEST, 'Invalid token'));
    }
    next();
  });
}
