import passport from 'passport';
import passportHttp from 'passport-http';

const basicStatergy = passportHttp.BasicStatergy;

export function authenticate (req, res, next) {
  var mongoose = req.app.get('mongoose');
  var User = mongoose.model('User');
  var user = req.swagger.params.user.value;

  // find the user
  User.findOne({ name: user.username }, function (err, user) {
    if (err) next(err);

    if (!user) {
      next({ success: false, message: 'Authentication failed. User not found.' });
    } else if (User.password !== user.password) {
      next({ success: false, message: 'Authentication failed. Wrong password.' });
    }
  });
}

export function authorize (token, scopes, next) {
  if (token.username === 'username') {
    return next(true);
  }
  next(false);
}
