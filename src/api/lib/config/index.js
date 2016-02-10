import path from 'path';
import fs from 'fs';
import Debug from 'debug';
import _ from 'lodash';
import yaml from 'yamljs';

const debug = Debug('config');
const ENV_FILENAME = '.env';
const defaults = {
  swaggerFile: 'api/swagger/swagger.yaml',
  controllers: {
    useStubs: false,
    controllers: 'api/controllers',
    mocks: 'api/mocks'
  }
};

var configDir, config, env;

export default function load () {
  config.root = findAppRoot();
  config.dirpath = path.resolve(config.root, 'config');
  env = getEnvironment();

  var defaultConfig = readYamlFromConfigFile('default.yaml');
  var envConfig = env ? readYamlFromConfigFile(env + '.yaml') : {};

  config = _.extend(config, defaults, defaultConfig, envConfig);
  config.swaggerObject = readYamlFromConfigFile(config.swaggerFile);

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
