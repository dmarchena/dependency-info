/* jshint node: true */
'use strict';

var path = require('path');

/**
 * Dependency info object
 * @param {String} name   dependency name
 * @param {String} path   absolute path to dependency dir
 * @param {String} main?  absolute path to dependency main js
 */
function Dependency(name, dirpath, options){
  this.name = name;
  this.path = dirpath;
  this.parents = [];

  // if (arguments.length>2 && typeof arguments[2] !== 'undefined') {
  //   this.main = path.join(this.path, arguments[2]);
  // }
  // else {
  //   this.main = path.join(this.path, 'index.js');
  // }

  if (typeof options !== 'undefined') {
    if (options.parent instanceof Dependency) {
      this.parents = options.parent.parents;
      this.parents.push(options.parent.name);
    }
  }

  this.dependencies = [];
}

Dependency.prototype = {
  addDependency: function(dependency){
    if (this.hasDependency(dependency)) {
      return -1;
    }
    return this.dependencies.push(dependency)-1;
  },
  hasDependency: function(dependency){
    for (var i = 0, length = this.dependencies.length; i < length; i++) {
      if (this.dependencies[i].isEqualTo(dependency)) {
        return true;
      }
    }
    return false;
  },
  isEqualTo: function(dependency){
    return this.name == dependency.name;
  }
};

module.exports = Dependency;