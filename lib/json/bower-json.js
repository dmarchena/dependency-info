/* jshint node: true */
'use strict';

var ConfigJson = require('./config-json.js');

function BowerJson(options) {
  options.defaultFilename = 'bower.json';
  ConfigJson.apply(this, [options]);
}
BowerJson.prototype = Object.create(ConfigJson.prototype);  
BowerJson.prototype.constructor = BowerJson;  

module.exports = BowerJson;