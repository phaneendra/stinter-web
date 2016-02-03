export default (mongoose, modelName, schema, app) => {
  // create methods on the schema before converting to model
  // Schema.methods.doSomething = function()...
  //
  console.log('Intializing model' + modelName);

  return mongoose.model(modelName, schema);
};
