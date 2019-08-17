'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var handlebars = require('handlebars');
var PluginError = require('plugin-error');

var PLUGIN_NAME = 'gulp-blog-engine';

handlebars.registerHelper('include', function (file) {
  try {
    var content = fs.readFileSync(file, 'utf8');
    return new handlebars.SafeString(content);
  } catch (error) {
    console.error(PLUGIN_NAME, error.message)
    return new handlebars.SafeString('');
  }
});

function transform(file, encoding, callback) {
  if (file.isNull()) {
    // nothing to do
    return callback(null, file);
  }

  if (file.isStream()) {
    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
  }

  var rootdir = process.cwd() + '/'
  var filedir = path.parse(file.path).dir
  var filename = path.parse(file.path).name
  var isPartial = filename.startsWith('_')
  var source = file.contents.toString();

  if (isPartial) {
    var partialPrefix = filedir.replace(rootdir, '')
    var partialSuffix = filename.replace('_', '')
    var partialName = path.join(partialPrefix, partialSuffix);

    handlebars.registerPartial(partialName, source);
  } else {
    try {
      var template = handlebars.compile(source);
      var compiledHTML = template({})

      file.contents = Buffer.from(compiledHTML);
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err));
    }

    this.push(file);
  }

  return callback();
}

module.exports = function () {
  return through.obj(transform);
}
