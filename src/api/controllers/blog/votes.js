import util from 'util';

export function upVote (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Up Vote a Blog!', data: hello});
}

export function downVote (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Down Vote a Blog!', data: hello});
}
