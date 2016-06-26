'use strict';

var utils = require('../util/util.js');

function supported(root, cb) {
  var isGist = !!root.$('.gist-content').length;
  var isRepo = !!root.$('.repository-content').length;

  if (isRepo || isGist) {
    return cb(null, true);
  }
  cb(null, false);
}

function isMyCall(call, url) {
  var file = call.file;
  url = url.split('#')[0];
  return url.indexOf(file) === url.length - file.length;
}

function getTargetObject(func, functions) {

  for (var i = 0; i < functions.length; i++) {
    if (functions[i].ID == func) { return functions[i]; }
  }

  return undefined;
}

function init(root, data, options, cb) {

  var result = [];
  var locationUrl = root.location.href;
  var $ = root.$;
  var $root = $('table.js-file-line-container');
  if (!$root || $root.length === 0) { return; }

  var mycalls = data['calls']
      .filter(function(x) { return isMyCall(x, locationUrl); });

  mycalls.forEach(function(call) {
    var $td = $root.find("#LC" + call.line);
    var func = call.to;
    var target = getTargetObject(func, data['functions']);
    var link = 'https://github.com/cran/' + data['package'] +
	'/blob/master' + target.file + '#L' + target.line;

    var content = $td.html()
	.replace(
	  new RegExp('\\b' + func + '\\b'),
	  '<a class="cran-browser" href="' + link + '">' + func + '</a>'
	);
    $td.html(content);
  });

  cb(null, result);
}

module.exports =  function(root, data, options, cb) {
  supported(root, function(err, invoke) {
    if (err) {
      return cb(err);
    }
    if (!invoke) {
      return cb(null);
    }
    init(root, data, options, cb);
  });
};
