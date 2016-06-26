'use strict';

var async = require('async');
var _ = require('lodash');
var utils = require('../util/util.js');

function loader(urls, options, cb) {
  options = options || {};
  options.type = options.type || 'GET';
  if (typeof urls === 'string') {
    urls = [urls];
  }
  var url = urls.shift();

  $.ajax({
    type: options.type,
    url: url}
  ).then(function(body) {
    cb(null, body, url);
  }).fail(function(xhr) {
    if (urls.length) {
      return loader(urls, options, cb);
    }
    cb(xhr);
  });
}

module.exports = function(root, options, cb) {

  var InvokeModule = {};
  var modules = {
    require:  require('./require.js'),
    manifest:  require('./manifest.js')
  };

  // Download the data here, and call all callbacks
  var cranfile = utils.cranFile(root);
  var fileurl = utils.fileUrl(cranfile);
  loader(fileurl, { type: 'GET' }, function(err, body, url) {
    if (err) return cb(err);

    _.each(modules, function(func, key) {
      InvokeModule[key] = function(cb) {
	func(root, body, options, cb);
      };
    });

    async.parallel(InvokeModule, function(err, results) {
      if (err) {
	return cb(err);
      }
      cb(null, results);
    });
  });
};
