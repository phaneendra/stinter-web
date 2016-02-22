import querystring from 'querystring';
import httpStatus from 'http-status';

function makeError (code, message) {
  var err = new Error(message || httpStatus[code]);
  err.statusCode = code;
  return err;
}

export default function (passport, activeServices, token, callbackURLs) {
  return {
    socialAuth: function (req, res, next) {
      var provider = req.params.provider;
      if (!activeServices[provider]) {
        return next();
      }
      passport.authenticate(provider, {scope: activeServices[provider].scope})(req, res, next);
    },

    socialAuthCallback: function (req, res, next) {
      var provider = req.params.provider;
      if (!activeServices[provider]) {
        return next();
      }
      passport.authenticate(provider, function (err, user) {
        if (err) {
          return next(makeError(httpStatus.INTERNAL_SERVER_ERROR, err.message));
        }
        if (!user) {
          return res.redirect(callbackURLs.failure);
        }
        token.generate(user, function (err, result) {
          if (err) {
            return next(makeError(httpStatus.INTERNAL_SERVER_ERROR, err.message));
          }
          res.redirect(callbackURLs.success + '?' + querystring.stringify({token: JSON.stringify(result)}));
        });
      })(req, res, next);
    }
  };
}
