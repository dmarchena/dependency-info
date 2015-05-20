/* jshint node: true */
'use strict';

var Dependency = require('../dependency.js'),
    checkIf = require('./check-if.js')(),
    path = require('path');

function SearchEngine(tree) {
  this.basePath = tree.path;
  this.dependenciesManager = tree.dependenciesManager;
  this.dependenciesType = tree.dependenciesType;
  this.dependenciesDirname = 
    (this.dependenciesManager === 'bower') ? 
    'bower_components' : 
    'node_modules';
  this.filterBy = tree.filterBy;
}

SearchEngine.prototype = (function () {

  /**
   * Scan for dependencies
   * 
   * @param  {Dependency} current       Target dependency
   * @param  {Dependency} dependent?    Target dependency's dependent
   */
  var scan = function scan(current, dependent) {

    var currentDepBasePath = 
          (this.dependenciesManager === 'npm')?
            current.path:
            this.basePath,
        isNotFirstScan = (dependent instanceof Dependency),
        doesntPassTheFilter = checkIf.
          configJson(current.configJson, this.dependenciesManager).
          doesntPassTheFilter(this.filterBy);

    if (isNotFirstScan && doesntPassTheFilter) {
      return null;
    }

    if (current instanceof Dependency) {
      if (isNotFirstScan) {
        dependent.addDependency(current);
      }
      for (var i = 0, length = this.dependenciesType.length; i<length; i++) {
        var t = this.dependenciesType[i];
        for (var k in current.json[t]) {
          scan.call(this, 
            new Dependency(
              path.join(currentDepBasePath, this.dependenciesDirname, k), // Dependency path
              this.dependenciesManager  // Dependency type
            ), 
            current);
        }
      }
    }
  };

  var fetchDependencies = function fetchDependencies(searchRootPath, callback) {
    var mainDependent = new Dependency(searchRootPath, this.dependenciesManager);
    scan.call(this, mainDependent);
    if(typeof callback === 'function') {
      callback.call(this, mainDependent.dependencies);
    } else {
      return mainDependent.dependencies;
    }
  };

  return {
    fetchDependencies: fetchDependencies
  };

}());

module.exports = SearchEngine;



