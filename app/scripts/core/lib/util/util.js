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

var cranPackage = function(root) {
  var parser = document.createElement('a');
  parser.href = root.location.href;
  var comps = parser.pathname.split('/');
  if (comps[1] == 'cran') {
    return comps[2];
  } else {
    return undefined;
  }
}

var cranPackageLink = function(pkg) {
  return 'https://github.com/cran/' + pkg;
}

var mapUrl = function(pkg) {
  return 'https://code.r-pkg.org/api/map/' + pkg;
}

module.exports = {
  stripQuotes: stripQuotes,
  urlMatch: urlMatch,
  showLoader: showLoader,
  cranPackage: cranPackage,
  mapUrl: mapUrl,
  cranPackageLink: cranPackageLink
};
