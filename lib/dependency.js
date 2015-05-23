/* jshint node: true */
'use strict';

var path = require('path'),
    configJsonFactory = require('./json/config-json-factory.js');

/**
 * Dependency object with information about a specific package.
 * @param {String} dirpath Path to dependency dir
 * @param {String} type    Dependency type: 'npm' or 'bower'
 */
function Dependency(dirpath, configJson){
  this.configJson = configJson;
  this.json = configJson.content;
  this.name = configJson.content.name;
  this.path = dirpath;
  this.dependents = [];
  this.dependencies = [];
}

Dependency.prototype = {

  /**
   * Add the given dependency as a child dependency of this instance
   * 
   * @param {Dependency} dependency   Child dependency
   */
  addDependency: function(dependency){
    if (this.hasDependency(dependency)) {
      return -1;
    }
    dependency.dependents = this.dependents.slice(0);
    dependency.dependents.push(this.name);
    return this.dependencies.push(dependency)-1;
  },

  /**
   * Checks whether the given dependendy is a child of this instance
   * 
   * @param  {Dependency}  dependency  Dependency to search for
   * @param  {Boolean}  deep           If true, it will be a deep search through descendants of this instance
   * @return {Boolean}                 This method returns true if dependency is a child. If not, false.
   */
  hasDependency: function(dependency, deep){
    for (var i = 0, length = this.dependencies.length; i < length; i++) {
      var d = this.dependencies[i];
      if (dependency.isEqualTo(d)) {
        return true;
      } else if (typeof deep !== 'undefined' && deep === true){
        if (d.hasDependency(dependency, deep)) {
          return true;
        }
      }
    }
    return false;
  },

  /**
   * Checks whether the given dependendy is equal to this instance.
   * 
   * @param  {Dependency}  dependency   Dependency to compare
   * @return {Boolean}                  This method returns true if dependency is equal to this instance. If not, false.
   */
  isEqualTo: function(dependency){
    return this.name == dependency.name;
  }
};

module.exports = Dependency;