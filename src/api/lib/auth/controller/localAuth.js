// Auth controller that is used to handle
// * /auth/token - called during login flow
// * /auth/invalidate - called during logout flow
// * /auth/social -

import httpStatus from 'http-status';
import passport from 'passport';
import { authenticate } from '../helpers/auth';
import * as token from '../helpers/token';

function makeError (code, message) {
  var err = new Error(message || httpStatus[code]);
  err.statusCode = code;
  return err;
}

export function getToken (req, res, next) {
  passport.authenticate('local', {session: false}, function (err, user, info) {
    if (err) { return next(makeError(httpStatus.BAD_REQUEST, err.message)); }
    if (!user) { return next(makeError(httpStatus.BAD_REQUEST, err.message)); }
    // req.logIn(user, function(err) {
    //   if (err) { return next(err); }
    //   return res.redirect('/users/' + user.username);
    // });
  })(req, res, next);

  // authenticate(req, res, function (err, _user) {
  //   if (err) {
  //     return next(makeError(httpStatus.BAD_REQUEST, err.message));
  //   }
  //   token.generate(_user, function (err, token) {
  //     if (err) {
  //       return next(makeError(httpStatus.INTERNAL_SERVER_ERROR));
  //     }
  //     next(null, token);
  //   });
  // });
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
