'use strict';

var scannerFactory = require('./scanner-factory.js'),
    scannerType = 'npm';

function pluginScan(appMainPath) {
  var scanner = scannerFactory.createScanner(scannerType);
  return scanner.fetchArinPlugins(appMainPath);
}

module.exports = pluginScan;