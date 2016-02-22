import moment from 'moment';

export default (mongoose, ModelName, Schema, app) => {
  // create methods on the schema before converting to model
  // Schema.methods.doSomething = function()...

  // Virtuals
  Schema.virtual('url').get(function () {
    var date = moment(this.date);
    var formatted = date.format('YYYY[/]MM[/]'); // formatted results in the format '2012/10/'
    return formatted + this.slug;
  });
  Schema.set('toObject', { getters: true });

  /**
   * Validations
   */
  Schema.path('title').required(true, 'Article title cannot be blank');
  Schema.path('content').required(true, 'Article body cannot be blank');
  Schema.path('createdDate').default(Date.now);
  Schema.path('isPublished').default(false);

  /**
   * Pre-save hook
   */
  // Generate the slug
  Schema.pre('save', function (next) {
    this.slug = this.slugify(this.title);
    next();
  });
  Schema.pre('update', function () {
    this.update({}, { $set: { lastUpdatedDate: new Date() } });
  });

  /**
   * Methods
   */
  Schema.methods = {
    slugify: function (text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
    }
  };

  return mongoose.model(ModelName, Schema);
};
