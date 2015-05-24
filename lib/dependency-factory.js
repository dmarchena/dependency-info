/* jshint node: true */
'use strict';

var configJsonFactory = require('./json/config-json-factory.js'),
    Dependency = require('./dependency.js');

function DependencyFactory() {}

DependencyFactory.prototype = (function () {

  /**
   * Creates a new Dependency. 
   * It will return null if the package is not installed.
   * @param {String} dirpath  Path to dependency dir
   * @param {String} type     Dependency type: 'npm' or 'bower'
   * @return {Dependency}     The Depencency related to path or null if it is not installed
   */
  var createDependency = function createDependency(dirpath, type) {
    var configJson,
        instance;

    try {
      configJson = configJsonFactory.createConfigJson(dirpath, type);
    } catch(err) {
      if (err.name === 'FileNotFound') {
        //console.log(err);
        configJson = null;
      } else {
        /* istanbul ignore next */
        throw err;
      }
    }
    
    // Dependency is not installed and the method cannot access to its json
    if (configJson === null) {
      return null;
    }

    instance = new Dependency(dirpath, configJson);
    return instance;
  };

  return {
    createDependency: createDependency
  };

}());

module.exports = new DependencyFactory();