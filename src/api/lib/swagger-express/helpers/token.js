import jwt from 'jsonwebtoken';

export function generate (user, next) {
  next(null, {
    'access_token': jwt.sign({
      username: user.username
    }, 'secret')
  });
}

export function verify (token, next) {
  jwt.verify(token, 'secret', next);
}

export function invalidate (token, next) {
  next(null, true);
}
