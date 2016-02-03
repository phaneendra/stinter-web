import _ from 'lodash';
import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var allowedTypes = ['number', 'integer', 'long', 'float', 'double', 'string', 'password', 'boolean', 'date', 'dateTime', 'array'];
var definitions = null;

var propertyMap = function (property) {
  switch (property.type) {
    case 'number':
      switch (property.format) {
        case 'integer':
        case 'long':
        case 'float':
        case 'double':
          return Number;
        default:
          throw new Error('Unrecognised schema format: ' + property.format);
      }
      break;
    case 'integer':
    case 'long' :
    case 'float' :
    case 'double' :
      return Number;
    case 'string':
    case 'password':
      return String;
    case 'boolean':
      return Boolean;
    case 'date':
    case 'dateTime':
      return Date;
    case 'array':
      return [propertyMap(property.items)];
    default:
      throw new Error('Unrecognized schema type: ' + property.type);
  }
};

var convertToJSON = function (spec) {
  var swaggerJSON = {};
  var type = typeof (spec);
  switch (type) {
    case 'object':
      if (spec instanceof Buffer) {
        swaggerJSON = JSON.parse(spec);
      } else {
        swaggerJSON = spec;
      }
      break;
    case 'string':
      swaggerJSON = JSON.parse(spec);
      break;
    default:
      throw new Error('Unknown or invalid spec object');
  }
  return swaggerJSON;
};

var isSimpleSchema = function (schema) {
  return schema.type && isAllowedType(schema.type);
};

var isAllowedType = function (type) {
  return allowedTypes.indexOf(type) !== -1;
};

var isPropertyHasRef = function (property) {
  return property['$ref'] || ((property['type'] === 'array') && (property['items']['$ref']));
};

var fillRequired = function (object, key, template) {
  if (template.indexOf(key) >= 0) {
    object[key].required = true;
  }
};

var applyExtraDefinitions = function (definitions, _extraDefinitions) {
  if (_extraDefinitions) {
    var extraDefinitions = JSON.parse(_extraDefinitions);
    _.each(extraDefinitions, function (val, key) {
      var s = key.split('.');
      var _definition = definitions;
      for (var i = 0; i < s.length; i++) {
        if (!_definition[s[i]]) {
          throw new Error('Wrong path: ' + key);
        }

        _definition = _definition[s[i]];
      }
      _definition._mongoose = val;
    });
  }
};

var isMongooseProperty = function (property) {
  return !!property._mongoose;
};

var isMongooseArray = function (property) {
  return property.items && property.items._mongoose;
};

var getMongooseSpecific = function (props, property) {
  var mongooseSpecific = property._mongoose;
  var ref = property.$ref;

  if (!mongooseSpecific && isMongooseArray(property)) {
    mongooseSpecific = property.items._mongoose;
    ref = property.items.$ref;
  }

  if (!mongooseSpecific) {
    return props;
  }

  var ret = {};

  if (mongooseSpecific.type === 'objectId') {
    ret.type = Schema.Types.ObjectId;
    if (mongooseSpecific.includeSwaggerRef !== false) {
      ret.ref = ref.replace('#/definitions/', '');
    }
  }

  return ret;
};

var isMongodbReserved = function (fieldKey) {
  return fieldKey === '_id' || fieldKey === '__v';
};

var processRef = function (property, objectName, props, key, required) {
  var refRegExp = /^#\/definitions\/(\w*)$/;
  var refString = property['$ref'] ? property['$ref'] : property['items']['$ref'];
  var propType = refString.match(refRegExp)[1];
  if (propType !== objectName) {
    // NOT circular reference
    props[key] = [getSchema(propType, definitions[propType]['properties'] ? definitions[propType]['properties'] : definitions[propType])];
  } else {
    // circular reference
    props[key] = {
      type: Schema.Types.ObjectId,
      ref: objectName
    };
  }
  fillRequired(props, key, required);
};

var getSchema = function (objectName, fullObject) {
  var props = {};
  var required = fullObject.required || [];
  var object = fullObject['properties'] ? fullObject['properties'] : fullObject;

  _.forEach(object, function (property, key) {
    if (isMongodbReserved(key) === true) {
      return;
    }

    if (isMongooseProperty(property)) {
      props[key] = getMongooseSpecific(props, property);
    } else if (isMongooseArray(property)) {
      props[key] = [getMongooseSpecific(props, property)];
    } else if (isPropertyHasRef(property)) {
      processRef(property, objectName, props, key, required);
    } else if (property.type) {
      var type = propertyMap(property);
      props[key] = {type: type};
      fillRequired(props, key, required);
    } else if (isSimpleSchema(object)) {
      props = {type: propertyMap(object)};
    }
  });

  return props;
};

export function compileAsync (spec, callback) {
  try {
    callback(null, this.compile(spec));
  } catch (err) {
    callback({message: err}, null);
  }
}

export function compile (spec, _extraDefinitions) {
  if (!spec) throw new Error('Swagger spec not supplied');

  var swaggerJSON = convertToJSON(spec);
  definitions = swaggerJSON['definitions'];
  applyExtraDefinitions(definitions, _extraDefinitions);

  var schemas = {};
  _.forEach(definitions, function (definition, key) {
    var object = getSchema(key, definition);
    schemas[key] = new mongoose.Schema(object);
  });

  return schemas;

  // var models = {};
  // _.forEach(schemas, function (schema, key) {
  //   models[key] = mongoose.model(key, schema);
  // });

  // return {
  //   schemas: schemas,
  //   models: models
  // };
}
