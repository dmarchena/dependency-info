/* jshint node: true */
'use strict';

var path = require('path'),
    configJsonFactory = require('./json/config-json-factory.js');

/**
 * Dependency info object
 * @param {String} name   dependency name
 * @param {String} path   absolute path to dependency dir
 * @param {String} main?  absolute path to dependency main js
 */
function Dependency(dirpath, type){
  this.configJson = configJsonFactory.createConfigJson(dirpath, type);
  if (this.configJson === null && this.configJson.content === null) {
    return null;
  }

  this.name = this.configJson.content.name;
  this.path = dirpath;
  this.dependents = [];
  this.dependencies = [];
  this.type = type;
  this.json = this.configJson.content;
}

Dependency.prototype = {
  addDependency: function(dependency){
    if (this.hasDependency(dependency)) {
      return -1;
    }
    dependency.dependents = this.dependents.slice(0);
    dependency.dependents.push(this.name);
    return this.dependencies.push(dependency)-1;
  },
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
  hasDependant: function(dependency){
  },
  isEqualTo: function(dependency){
    return this.name == dependency.name;
  }
};

module.exports = Dependency;