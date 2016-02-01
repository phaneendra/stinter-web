export default (mongoose, modelName, schema, app) => {
  // create methods on the schema before converting to model
  // Schema.methods.doSomething = function()...

  return mongoose.model(modelName, schema);
};
