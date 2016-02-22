import util from 'util';

export function createUser (req, res, next) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var User = mongoose.model('User');
  var user = new User(req.swagger.params.user.value);
  user.save((err) => {
    if (err) {
      next(err);
    } else {
      // this sends back a JSON response which is a single string
      res.status(200).json({ message: 'User added!', data: user });
    }
  });
}

export function viewProfile (req, res, next) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var User = mongoose.model('User');
  // Use the User model to find a specific user
  User.findById(req.swagger.params.id.value, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({message: 'View a User!', data: user});
    }
  });
}
