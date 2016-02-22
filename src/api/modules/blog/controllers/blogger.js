import util from 'util';

export function createBlog (req, res, next) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var Blog = mongoose.model('Blog');
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
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);
  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Blog Listing!', data: hello});
}

export function updateBlog (req, res, next) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var Blog = mongoose.model('Blog');
  // Use the Blog model to find a specific blog
  Blog.findById(req.swagger.params.id.value, function (err, blog) {
    if (err) {
      next(err);
    } else {
      // Update the existing beer quantity
      blog.content = req.swagger.params.blog.value.content;
      blog.title = req.swagger.params.blog.value.title;

      // Save the beer and check for errors
      blog.save((err) => {
        if (err) {
          next(err);
        } else {
          // this sends back a JSON response which is a single string
          res.status(200).json({ message: 'Blog updated!', data: blog._id });
        }
      });
    }
  });
}

export function viewBlog (req, res) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var Blog = mongoose.model('Blog');

  // Use the Blog model to find a specific blog
  Blog.findById(req.swagger.params.id.value, function (err, blog) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({message: 'View a Blog!', data: blog});
    }
  });
}

export function removeBlog (req, res) {
  var app = req.app;
  var mongoose = app.get('mongoose');

  var Blog = mongoose.model('Blog');

  // Use the Beer model to find a specific beer and remove it
  Blog.findByIdAndRemove(req.swagger.params.id.value, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Blog removed from application!' });
    }
  });
}

export function publishBlog (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Publish a Blog!', data: hello});
}

export function markRead (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!,This is not implemented now', name);

  // this sends back a JSON response which is a single string
  res.status(200).json({message: 'Mark the Blog as read!', data: hello});
}
