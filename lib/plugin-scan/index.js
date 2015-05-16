/* jshint node: true */
'use strict';

var scannerFactory = require('./scanner-factory.js'),
    scannerType = 'npm';

function searchPackagesIn(appMainPath) {
  var scanner = scannerFactory.createScanner(scannerType);
  return scanner.fetchArinPlugins(appMainPath);
}

module.exports = searchPackagesIn;