'use strict';

var utils = require('../util/util.js');

function parseTarget(call) {
    var from = call.from;
    var pkg, to;
    if (/::/.test(call.to)) {
	pkg = call.to.replace(/^([^:]*).*$/, function(x, $1) { return $1 });
	to = call.to.replace(/^[^:]*::(.*)$/, function(x, $1) { return $1 });
    } else {
	pkg = 'devtools';
	to = call.to;
    }

    return { 'from': from, 'pkg': pkg, 'to': to };
}

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

function init(root, data, options, cb) {

  var result = [];
  var locationUrl = root.location.href;
  var $ = root.$;
  var $root = $('table.js-file-line-container');
  if (!$root || $root.length === 0) { return; }

  data.forEach(function(call) {
    var $td = $root.find("#LC" + call.line);
    var target = parseTarget(call);

    var link = 'https://code.r-pkg.org/api/redirect/' + target.pkg + '/' +
	  target.to;

    // TODO: proper replacement intead of this
    var content = $td.html()
	.replace(
	  new RegExp('\\b' + target.to + '\\b'),
	  '<a class="cran-browser" href="' + link + '">' + target.to + '</a>'
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
