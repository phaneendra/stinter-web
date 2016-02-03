import util from 'util';

export function createBlog (req, res, next) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var Blog = mongoose.model('Blog');
  console.log(req.swagger.params.blog.value);
  var blog = new Blog(req.swagger.params.blog.value);
  blog.save((err) => {
    if (err) {
      next(err);
    } else {
      // this sends back a JSON response which is a single string
      res.status(200).json({ message: 'Blog added!', data: blog._id });
    }
  });
}

export function listBlogs (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var title = req.swagger.params.title.value || 'stranger';
  var hello = util.format(title);
  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Blog Listing!', data: hello});
}

export function updateBlog (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json({a:1});
}

export function viewBlog (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}

export function removeBlog (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}

export function publishBlog (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}

export function markRead (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}
