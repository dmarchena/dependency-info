var path = require('path');

/**
 * Arin plugin object
 * @param {String} name   plugin name
 * @param {String} path   absolute path to plugin dir
 * @param {String} main?  absolute path to module main js
 */
function Plugin(name, dirpath){
  this.name = name;
  this.path = dirpath;

  if (arguments.length>2) {
    this.main = path.join(this.path, arguments[2]);
  }
  else {
    this.main = path.join(this.path, 'sass/index.scss');
  }

  this.arinDependencies = [];
}

Plugin.prototype = {
  addDependency: function(arinPlugin){
    if (this.hasDependency(arinPlugin)) {
      return -1;
    }
    return this.arinDependencies.push(arinPlugin)-1;
  },
  hasDependency: function(arinPlugin){
    for (var i=0, length=this.arinDependencies.length; i<length; i++) {
      if (this.arinDependencies[i].isEqualTo(arinPlugin)) {
        return true;
      }
    }
    return false;
  },
  isEqualTo: function(arinPlugin){
    return this.name == arinPlugin.name;
  }
}

module.exports = Plugin;