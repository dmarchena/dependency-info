/* jshint node: true */
'use strict';

var ConfigJson = require('./config-json.js');

function PackageJson(options) {
  options.defaultFilename = 'package.json';
  ConfigJson.apply(this, [options]);
}
PackageJson.prototype = Object.create(ConfigJson.prototype);  
PackageJson.prototype.constructor = PackageJson;

module.exports = PackageJson;