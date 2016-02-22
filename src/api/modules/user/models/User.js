import bcrypt from 'bcryptjs';

export default (mongoose, ModelName, Schema, app) => {
  // create methods on the schema before converting to model
  // Schema.methods.doSomething = function()...
  //
  console.log('Intializing model' + ModelName);

  /**
   * Validations
   */
  Schema.path('username').required(true, 'Username cannot be blank');
  Schema.path('password').required(true, 'Password cannot be blank');

  /**
   * Pre-save hook
   */
  Schema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            return next(err);
          }
          user.password = hash;
          next();
        });
      });
    } else {
      return next();
    }
  });

  Schema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  return mongoose.model(ModelName, Schema);
};
