'use strict';

var _ = require('lodash');

var urlMatch = function(url, lookup) {

  var urlContains = function(indicator) {
    url = url.split('#')[0];
    return url.indexOf(indicator) === url.length - indicator.length;
  };

  return _.find(lookup, function(type, urlFragment) {
    return urlContains(urlFragment);
  });
};

var stripQuotes = function(jqElement) {
  return jqElement.text().replace(/"|'/g, '').trim();
};

var showLoader = function($) {
  $('.page-context-loader').addClass('is-context-loading');
};

var cranFile = function(root) {
  var parser = document.createElement('a');
  parser.href = root.location.href;
  var comps = parser.pathname.split('/');
  if (comps[1] == 'cran') {
      var pkg = comps[2];
      var file = comps[comps.length - 1];
      var blob = comps.indexOf('blob');
      if (blob > -1) {
	  // need to drop the banch as well, hence + 2
	  file = comps.slice(blob + 2, comps.length).join('/');
      }

      return { 'package': pkg, 'file': file }
  } else {
      return undefined;
  }
}

var fileUrl = function(cranfile) {
    return 'https://code.r-pkg.org/api/filelinks/' +
	cranfile.package +
	'/' +
	cranfile.file;
}

module.exports = {
  stripQuotes: stripQuotes,
  urlMatch: urlMatch,
  showLoader: showLoader,
  cranFile: cranFile,
  fileUrl: fileUrl
};
