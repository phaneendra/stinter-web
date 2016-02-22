/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import jwt from 'passport-jwt';

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const User = mongoose.model('User');

/**
 * Expose
 */
export default function (config) {
  return new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.jwt.secret,
    issuer: config.jwt.secret.issuer,
    audience: config.jwt.secret.audience,
    passReqToCallback: false
  }, function (payload, done) {
    const options = {
      criteria: { id: payload.id }
    };
    User.load(options, function (err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      return done(null, user);
    });
  });
}
