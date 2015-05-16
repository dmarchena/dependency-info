/* jshint node: true */
'use strict';

var Dependency = require('../dependency.js'),
    configJsonFactory = require('../json/config-json-factory.js'),
    checkIf = require('./check-if.js'),
    path = require('path');

function SearchEngine(options) {
  this.dependenciesManager = options.manager;
  this.dependenciesType = options.type;
  this.dependenciesDirname = 
    (this.type === 'bower') ? 
    'components' : 
    'node_modules';
}

SearchEngine.prototype = (function () {

  /**
   * Scan for dependencies
   * 
   * @param  {Dependency} current       Target dependency
   * @param  {Dependency} parent?       Target dependency's parent
   * @param  {String} filter?           Package.json query to verify
   * @return {Dependency}               Main project with all info
   */
  var scan = function scan(current, parent) {

    var packageJson = configJsonFactory.createConfigJson(this.dependenciesManager, current.path),
        depName,
        depPath,
        isNotFirstScan = (parent instanceof Dependency);

    if (packageJson === null) {
      return null;
    }

    if (isNotFirstScan && checkIf.packageJson(packageJson).has.not.keyword('search-target')) {
      return null;
    }

    if (current instanceof Dependency) {
      for (var k in packageJson.json.devDependencies) {
        depName = k;
        depPath = path.join(current.path, this.dependenciesDirname, k);
        scan.call(this, new Dependency(depName, depPath), current);
      }
      if (isNotFirstScan) {
        parent.addDependency(current);
      }
    }

    return current;

  };

  var fetchDependencies = function fetchDependencies(searchRootPath) {
    var scanParentModule = scan.call(this, new Dependency('auxRootModule', searchRootPath));
    return scanParentModule.dependencies;
  };

  return {
    fetchDependencies: fetchDependencies
  };

}());

module.exports = SearchEngine;



