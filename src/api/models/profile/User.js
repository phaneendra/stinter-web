export default (mongoose, modelName, schema, app) => {
  // create methods on the schema before converting to model
  // Schema.methods.doSomething = function()...
  //
  console.log('Intializing model' + modelName);

  /**
   * Validations
   */
  Schema.path('username').required(true, 'Username cannot be blank');
  Schema.path('password').required(true, 'Password cannot be blank');

  return mongoose.model(modelName, schema);
};
