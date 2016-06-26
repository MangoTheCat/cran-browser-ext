'use strict';

var utils = require('../util/util.js');

var getType = function(url) {
  var lookup = {
    '/DESCRIPTION': 'description'
  };
  return utils.urlMatch(url, lookup);
};

var dependencieField = function(root, links) {

  var $ = root.$;
  var result = [];
  var $root = $('table.js-file-line-container');

  if (!$root || $root.length === 0) { return; }

  links.forEach(function(dep) {
    var $td = $root.find("#LC" + dep.line);
    var pkg = dep.dependency;
    var link = utils.cranPackageLink(pkg);
    var content = $td.html()
	.replace(
	  new RegExp('\\b' + pkg + '\\b'),
	  '<a class="cran-browser" href="' + link + '">' + pkg + '</a>'
	);
    $td.html(content);
  });

  return result;
};

function supported(root, cb) {
  cb(null, !!getType(root.location.href));
}

function init(root, data, options, cb) {
  var url = root.location.href;
  var $ = root.$;

  var result = dependencieField(root, data['description']);
  // put them below dependencieField to avoid conflict

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
