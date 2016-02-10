import _ from 'lodash';
import httpStatus from 'http-status';
import helpers from './utils';

// NOT_FOUND is temp: when id in invalid format and the cast to objectId fails - actually it means that resource not found
var ACCEPTED_RESPONSES_CODES = [httpStatus.BAD_REQUEST, httpStatus.NOT_FOUND];

function defaultErrorConverter (err) {
  return err;
}

export default function (errorConverter) {
  errorConverter = errorConverter || defaultErrorConverter;

  return function (err, req, res, next) {
    var result = {
      message: err.message
    };

    // user error
    // check the req.swagger in order to make sure its not socialAuth because req.swagger undefined
    if (res.statusCode === httpStatus.OK && !err.statusCode && !err.failedValidation && req.swagger) {
      result = errorConverter(err);
      var resp = helpers.getExpectedResponse(req.swagger.operation.responses, ACCEPTED_RESPONSES_CODES);
      if (result.statusCode) {
        res.statusCode = result.statusCode;
      } else if (resp) {
        res.statusCode = resp.code;
      } else {
        res.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        result = {
          message: 'error response schema not defined'
        };
      }
    } else if (err.failedValidation) { // Validation error
      if (res.statusCode === httpStatus.BAD_REQUEST) { // request validation
        result.errors = (err.results.errors && err.results.errors.length) ? {} : undefined;
        _.forEach(err.results.errors, function (value) {
          var paramAndMessage = value.message.split(': ');
          var path = value.path.join('.');
          result.errors[(path.length ? path + '.' : '') + paramAndMessage[1]] = paramAndMessage[0];
        });
      } else {
        res.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      }
    } else { // swagger-tools and auth controller errors
      res.statusCode = err.statusCode || res.statusCode; // err.statusCode is set when it's the auth controller error
    }

    var response = req.swagger && req.swagger.operation && (req.swagger.operation.responses[res.statusCode] || req.swagger.operation.responses['default']); // operation not exist when error code 405

    result = (result && response && response.schema) ? helpers.convertResponseToExpectedFormat(result, response.schema) : result;

    res.json(result);
  };
}
