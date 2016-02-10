import _ from 'lodash';

export function convertParamsToArray (params) {
  var array = [];
  _.forEach(params, function (value) {
    array.push(exports.convertResponseToExpectedFormat(value.schema.type === 'array' ? (value.originalValue ? value.originalValue.split(',') : undefined) : value.value, value.schema));
  });
  return array;
}

export function convertResponseToExpectedFormat (result, schema) {
  var retval = result;   // primitive type
  if (result && schema.properties) {   // object
    retval = {};
    _.forEach(schema.properties, function (value, key) {
      if (typeof result[key] !== 'undefined') {
        retval[key] = exports.convertResponseToExpectedFormat(result[key], value);
      }
    });
  } else if (result && schema.items) {   // array
    retval = [];
    _.forEach(result, function (value, key) {
      retval[key] = exports.convertResponseToExpectedFormat(value, schema.items);
    });
  }
  return retval;
}

// Get the defined response object from swagger schema for the response code passed
export function getExpectedResponse (responses, acceptedResponsesCodes) {
  _.forEach(acceptedResponsesCodes, function (responseCode) {
    if (responses[responseCode]) {
      return {
        code: responseCode,
        schema: responses[responseCode].schema
      };
    }
  });
  return null;
}
