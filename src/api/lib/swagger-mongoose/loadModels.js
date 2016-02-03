import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import * as swaggerSchemas from './loadSchemas.js';

function walk (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });
  return results;
}

export function load (mongoose, config, recursive, app) {
  var modelName = [];
  var files = [];

  if (!mongoose) {
    mongoose = require('mongoose');
  }

  mongoose.models = {};

  if (!config.hasOwnProperty(('models'))) {
    config.models = './models';
  }

  var loadPath = path.join(process.cwd(), config.models);

  if (!recursive) {
    files = fs.readdirSync(loadPath);
  } else {
    files = walk(loadPath);
  }

  var schemas = swaggerSchemas.compile(config.swaggerObject);

  for (var i in files) {
    var file = '';
    if (!recursive) {
      file = path.resolve(loadPath, files[i]);
    } else {
      file = path.resolve(files[i]);
    }

    if (fs.statSync(file).isFile()) {
      var name = path.basename(file);
      name = name.replace('.js', '');
      mongoose.models[name] = require(file).default(mongoose, name, schemas[name], app);

      modelName.push(name);
    }
  }

  _.forEach(schemas, function (schema, key) {
    if (!_.includes(modelName, key)) {
      mongoose.models[name] = mongoose.model(key, schema);
      modelName.push(key);
    }
  });

  return modelName;
}
