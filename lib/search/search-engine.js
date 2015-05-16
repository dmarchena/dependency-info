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
  this.filterBy = options.filterBy;
}

SearchEngine.prototype = (function () {

  /**
   * Scan for dependencies
   * 
   * @param  {Dependency} current       Target dependency
   * @param  {Dependency} parent?       Target dependency's parent
   * @return {Dependency}               current dependency with its info
   */
  var scan = function scan(current, parent) {

    var configJson = configJsonFactory.createConfigJson(this.dependenciesManager, current.path),
        depName,
        depPath,
        isNotFirstScan = (parent instanceof Dependency);

    if (configJson === null) {
      return null;
    }

    if (isNotFirstScan && !passesTheFilter.call(this, configJson)) {
      return null;
    }

    if (current instanceof Dependency) {
      for (var i = 0, length = this.dependenciesType.length; i<length; i++) {
        var t = this.dependenciesType[i];
        for (var k in configJson.json[t]) {
          scan.call(this,  
            new Dependency(
              k, // Dependency name
              path.join(current.path, this.dependenciesDirname, k) // Dependency path
            ), 
            current);
        }
      }
      if (isNotFirstScan) {
        parent.addDependency(current);
      }
    }

    return current;

  };

  var passesTheFilter = function passesTheFilter(configJson) {
    var keywords = this.filterBy.keyword;
    if (typeof keywords !== 'undefined') {
      if (typeof keywords === 'string') {
        keywords = [keywords];
      } 
      for (var i = 0, length = keywords.length; i < length; i++) {
        if(configJson.has.not.keyword(keywords[i])){
          return false;
        }
      }
    }
    return true;
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



