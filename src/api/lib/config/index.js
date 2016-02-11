import path from 'path';
import fs from 'fs';
import Debug from 'debug';
import _ from 'lodash';
import yaml from 'yamljs';
import glob from 'glob';

const debug = Debug('config');
const ENV_FILENAME = '.env';
const defaults = {
  swaggerFile: 'api/swagger/swagger.yaml',
  controllers: {
    useStubs: false,
    controller: 'api/controllers',
    mocks: 'api/mocks'
  },
  swaggerObject: {}
};

var configDir, config, env;

export default function load () {
  config.root = findAppRoot();
  config.dirpath = path.resolve(config.root, 'config');
  env = getEnvironment();

  var defaultConfig = readYamlFromConfigFile('default.yaml');
  var envConfig = env ? readYamlFromConfigFile(env + '.yaml') : {};

  config = _.extend(config, defaults, defaultConfig, envConfig);

  // parse all swagger files 'swagger.yaml' in app root and load into swaggerObject
  glob(config.root + '**/swagger.yaml', (err, swaggerFiles) => {
    if (err) {
      throw new Error('Can\'t find swagger yaml files');
    }
    var moduleSwaggerObject = readYamlFromConfigFile(swaggerFiles);
    config.swaggerObject = _.merge(config.swaggerObject, moduleSwaggerObject);
  });

  // add all controllers into controller object.
  glob(config.root + '**/controller/*.js', (err, controllerFiles) => {
    if (err) {
      throw new Error('failed attempt to read config:');
    }

    var controllerName = path.basename(controllerFiles, path.extname(controllerFiles));
    var controller = require(controllerFiles);
    debug('    %s%s:', controllerFiles, (_.isPlainObject(controller) ? '' : ' (not an object, skipped)'));
    if (_.isPlainObject(controller)) {
      _.each(controller, function (value, name) {
        var handlerId = controllerName + '_' + name;
        debug('      %s%s', handlerId, (_.isFunction(value) ? '' : ' (not a function, skipped)'));
        // TODO: Log this situation
        if (_.isFunction(value) && !config.controllers.controller[handlerId]) {
          config.controllers.controller[handlerId] = value;
        }
      });
    }
  });
  return config;
}

function findAppRoot () {
  var root = _.find([
    process.env.API_ROOT,
    path.resolve(__dirname).split('/node_modules')[0],
    path.dirname(require.main.filename),
    process.cwd()
  ], function (test) {
    return test && fs.existsSync(path.resolve(test, 'config')) && fs.existsSync(path.resolve(test, 'api'));
  });
  if (!root) {
    throw new Error('Can\'t find application root directory. Try setting env var: API_ROOT');
  }
  debug('Application root: %s', root);
  return root;
}

function readYamlFromConfigFile (fileName) {
  try {
    var file = path.resolve(configDir, fileName);
    var obj = yaml.load(file);
    if (debug.enabled) {
      debug('read config file: ' + file);
    }
    return obj;
  } catch (err) {
    if (debug.enabled) {
      debug('failed attempt to read config: ' + file);
    }
    return {};
  }
}

function getEnvironment () {
  if (env) {
    return env;
  }
  env = process.env.APP_ENV || process.env.NODE_ENV;
  if (!env) { // load from file
    var envFile = path.resolve(configDir, ENV_FILENAME);
    env = fs.readFileSync(envFile, 'utf8');
  }
  if (debug.enabled) {
    debug('set environment: ' + env);
  }
  return env;
}
