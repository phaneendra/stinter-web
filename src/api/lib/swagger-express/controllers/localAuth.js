// Auth controller that is used to handle
// * /auth/token
// * /auth/invalidate
//
'use strict';

var httpStatus = require('http-status');

function makeError (code, message) {

    var err = new Error(message || httpStatus[code]);
    err.statusCode = code;
    return err;

}

module.exports = function (token, auth) {

    return {

        getToken: function (user, done) {

            auth.authenticate(user.username, user.password, function (err, _user) {

                if (err) {
                    return done(makeError(httpStatus.BAD_REQUEST, err.message));
                }

                token.generate(_user, function (err, token) {

                    if (err) {
                        return done(makeError(httpStatus.INTERNAL_SERVER_ERROR));
                    }

                    done(null, token);

                });

            });

        },

        invalidateToken: function (authToken, done) {

            token.invalidate(authToken, function(err, isOk) {

                if (err) {
                    return done(makeError(httpStatus.INTERNAL_SERVER_ERROR));
                }

                if (!isOk) {
                    return done(makeError(httpStatus.BAD_REQUEST, 'Invalid token'));
                }

                done();

            });

        }

    };

};
