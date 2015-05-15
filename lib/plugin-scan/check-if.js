'use strict';

var packageConfigJsonFactory = require('./package-config-json.js').factory;

function checkIfBowerJson(source) {
  if (typeof source === 'string'){
    return packageConfigJsonFactory.createPackageConfigJson('bower', source);
  }
  return source;
}

function checkIfPackageJson(source) {
  if (typeof source === 'string'){
    return packageConfigJsonFactory.createPackageConfigJson('npm', source);
  }
  return source;
}

module.exports.bowerJson = checkIfBowerJson;
module.exports.packageJson = checkIfPackageJson;