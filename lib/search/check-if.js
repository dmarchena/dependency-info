/* jshint node: true */
'use strict';

var BowerJson = require('../json/bower-json.js'),
    PackageJson = require('../json/package-json.js'),
    configJsonFactory = require('../json/config-json-factory.js');

/**
 * Adds readability to BowerJson filters.
 * If source param is a path, returns a new BowerJson object. 
 * @param  {} source [description]
 * @return {BowerJson}        [description]
 */
function checkIfBowerJson(source) {
  if (typeof source === 'undefined') {
    throw new Error('"source" param is required.', 'checkIfBowerJson.js', 16);
  }
  if (source instanceof BowerJson) {
    return source;
  } else if (typeof source === 'string') {
    return configJsonFactory.createConfigJson('bower', source);
  } else {
    throw new TypeError('Unknown source: ' + source, 'checkIfBowerJson.js', 23);
  }
}

function checkIfPackageJson(source) {
  if (typeof source === 'undefined') {
    throw new Error('"source" param is required.', 'checkIfBowerJson.js', 28);
  }
  if (source instanceof PackageJson) {
    return source;
  } else if (typeof source === 'string') {
    return configJsonFactory.createConfigJson('npm', source);
  } else {
    throw new TypeError('Unknown source: ' + source, 'checkIfBowerJson.js', 36);
  }
}

module.exports.bowerJson = checkIfBowerJson;
module.exports.packageJson = checkIfPackageJson;