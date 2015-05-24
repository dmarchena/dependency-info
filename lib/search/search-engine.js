/* jshint node: true */
'use strict';

var Dependency = require('../dependency.js'),
    dependencyFactory = require('../dependency-factory.js'),
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
   * Scan for dependencies recursively
   * 
   * @param  {Dependency} current       Dependency whose info will be completed
   * @param  {Dependency} dependent?    Current dependency dependent (aka. parent)
   * @param  {Boolean}    deep          If true it will scan all dependencies, not only the direct ones
   */
  var scan = function scan(current, dependent, deep) {

    var currentDepBasePath,
        isNotFirstScan = (dependent instanceof Dependency),
        isFilterDefined = Object.keys(this.filterBy).length > 0,
        doesntPassTheFilter = false;

    if (current === null) return null;

    currentDepBasePath = 
      (this.dependenciesManager === 'npm')?
        current.path:
        this.basePath;

    if (isFilterDefined) {
      doesntPassTheFilter = 
        checkIf.
        configJson(current.configJson, this.dependenciesManager).
        doesntPassTheFilter(this.filterBy);
      if (doesntPassTheFilter) {
        return null;
      }
    }

    dependent.addDependency(current);

    if (deep === true && typeof current.json.dependencies !== 'undefined') {
      for (var k in current.json.dependencies) {
        scan.call(this, 
          dependencyFactory.createDependency(
            path.join(currentDepBasePath, this.dependenciesDirname, k), // Dependency path
            this.dependenciesManager  // Dependency type
          ), 
          current,
          deep);
      }
    }
  };

  /**
   * Revealed function to search for dependencies
   * 
   * @param  {String}   hostPath    Path to module whose dependencies will be fetched
   * @param  {Boolean}  deep        If true it will scan all dependencies, not only the direct ones
   * @param  {Function} callback    Callback function if search is async
   * @return {Array}                Multidimensional array of Dependency objects
   */
  var fetchDependencies = function fetchDependencies(hostPath, deep, callback) {
    var host = dependencyFactory.createDependency(hostPath, this.dependenciesManager);

    for (var i = 0, length = this.dependenciesType.length; i<length; i++) {
      var t = this.dependenciesType[i];
      if (typeof host.json[t] !== 'undefined') {
        for (var k in host.json[t]) {
          scan.call(this, 
            dependencyFactory.createDependency(
              path.join(this.basePath, this.dependenciesDirname, k), // Dependency path
              this.dependenciesManager  // Dependency type
            ), 
            host, // dependent
            deep // Deep scan
          );
        }
      }
    }

    if(typeof callback === 'function') {
      callback.call(this, host.dependencies);
    } else {
      return host.dependencies;
    }
  };

  return {
    fetchDependencies: fetchDependencies
  };

}());

module.exports = SearchEngine;



