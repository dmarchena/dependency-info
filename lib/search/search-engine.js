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
   */
  var scan = function scan(current, dependent) {

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
      doesntPassTheFilter = checkIf.
          configJson(current.configJson, this.dependenciesManager).
          doesntPassTheFilter(this.filterBy);
    }

    if (isNotFirstScan && doesntPassTheFilter) {
      return null;
    }

    if (current instanceof Dependency) {
      if (isNotFirstScan) {
        dependent.addDependency(current);
      }
      for (var i = 0, length = this.dependenciesType.length; i<length; i++) {
        var t = this.dependenciesType[i];
        if (typeof current.json[t] !== 'undefined') {
          for (var k in current.json[t]) {
            scan.call(this, 
              dependencyFactory.createDependency(
                path.join(currentDepBasePath, this.dependenciesDirname, k), // Dependency path
                this.dependenciesManager  // Dependency type
              ), 
              current);
          }
        }
      }
    }
  };

  /**
   * Revealed function to search for dependencies
   * 
   * @param  {String}   searchRootPath  Path to module whose dependencies will be fetched
   * @param  {Function} callback        Callback function if search is async
   * @return {Array}                    Multidimensional array of Dependency objects
   */
  var fetchDependencies = function fetchDependencies(searchRootPath, callback) {
    var mainDependent = dependencyFactory.createDependency(searchRootPath, this.dependenciesManager);
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



