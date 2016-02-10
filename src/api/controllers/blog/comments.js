import util from 'util';

export function addComment (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Add a comment!', data: hello});
}

export function updateComment (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Update a comment!', data: hello});
}

export function removeComment (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Remove a comment!', data: hello});
}

export function likeComment (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Like a comment!', data: hello});
}

export function dislikeComment (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Dislike a comment!', data: hello});
}
