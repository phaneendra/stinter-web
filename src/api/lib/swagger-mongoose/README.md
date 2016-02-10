# swagger-mongoose

Initialize mongoose and generate mongoose schemas and models from swagger documents.

It add all necessary code to manage mongoose:

- initialize it
- auto load models from yours models directory
- add basic events
- print startup info in console

## Usage

Simply pass your swagger document to the compile method, and then dynamically access the underlying mongoose models.

```js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swaggerMongoose = require('swagger-mongoose');

... your app code here

var options = {
  db: config.db,
  swaggerObject: config.swaggerObject,
  models: './src/api/models'
};

var db = swaggerMongoose(app, options);
```
## Working with models

The component uses swagger definitions to create the applications models, the models can be extended by adding a file in the models folder.
The component search in models folder and autoload all models by file.
The models name is the filename.

A simple example for user model swagger definitions, ./swagger/swagger.yaml

```yml
...

paths:
  # User paths
  /user:
    post:
      operationId: createUser
      summary: Creates a User
      description: |
        This method will create a user.
      tags:
        - User
      parameters:
        - name: user
          in: body
          description: The user to create
          required: true
          schema:
            $ref: '#/definitions/user'
      responses:
        201:
          description: The created user
          schema:
            $ref: '#/definitions/user'

...

definitions:
  # User definitions
  user:
    properties:
      id:
        type: integer
        format: int64
        description: The id of user
      username:
        type: string
        description: The username of user
      password:
        type: password
        description: The password of user

```

A simple example for user model extended for validations, ./models/user.js

```js
export default (mongoose, modelName, schema, app) => {
  // create methods on the schema before converting to model
  // Schema.methods.doSomething = function()...
  //
  console.log('Initialize model' + modelName);

  /**
   * Validations
   */
  Schema.path('username').required(true, 'Username cannot be blank');
  Schema.path('password').required(true, 'Password cannot be blank');

  return mongoose.model(modelName, schema);
};

```
## Using Models in Controllers

Now we have a user models and we can call it in controller/middleware, Mongoose is added as an app variable,so now if you have app, you can get mongoose and models.

```js
export function createUser (req, res, next) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var User = mongoose.model('user');
  var user = new User(req.swagger.params.user.value);
  user.save((err) => {
    if (err) {
      next(err);
    } else {
      // this sends back a JSON response which is a single string
      res.status(200).json({ message: 'User added!', data: user._id });
    }
  });
}
```
