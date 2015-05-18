/* jshint node: true */
'use strict';

var extend = require('extend'),
    search = require('./search');

function DependencyTree() {
}

DependencyTree.prototype = {
  /**
   * Retrieves a tree of Dependency objects
   * @param  {object} options     search config
   *   {
   *     path:           {string}  path to module which dependencies will be fetched. (default: process.cwd()) 
   *     manager:        {string}  'npm' (default) or 'bower'
   *     type:           {string}  'all' (default)
   *                     or
   *                     {array}   Accepted values: 'dependencies' and 'devDependencies'
   *     filterBy:       {object}
   *     {
   *       keywords:     {array} 
   *     }
   *   }
   * @return {Array}              tree of Dependency objects
   */
  init: function(options, callback) {
    var default_options = {
          path: process.cwd(), 
          manager: 'npm',
          type: 'all',
          filterBy: {} 
        },
        opts = extend(true, {}, default_options, options),
        isUnknownManager = (opts.manager !== 'npm' && opts.manager !== 'bower'),
        isTypeAnStringEqualToAll,
        isTypeAnEmptyArray,
        self = this;

    if (isUnknownManager) {
      throw new Error('Unknown manager: ' + opts.manager + ' ("npm" or "bower" accepted only)', 'index.js', 37);
    }

    isTypeAnStringEqualToAll = (typeof opts.type === 'string' && opts.type === 'all'); 
    isTypeAnEmptyArray = (Object.prototype.toString.call(opts.type) === '[object Array]' && opts.type.length === 0);
    if (isTypeAnStringEqualToAll || isTypeAnEmptyArray) {
      opts.type = ['dependencies', 'devDependencies'];
    }

    self.path = opts.path;
    self.dependenciesManager = opts.manager;
    self.dependenciesType = opts.type;
    self.filterBy = opts.filterBy;
    if (typeof callback === 'function'){
      try {
        search(self, function (dependencies) {
          self.dependencies = dependencies;
          callback.call(self, null, self);
        });
      } catch(err) {
        callback.call(self, err, null);
      }
    } else {
      self.dependencies = search(self);
    }
  },

  contains: function isDependencyInTree(dependencyObj) {
    for (var i=0, length = this.dependencies.length; i<length; i++) {
      var d = this.dependencies[i];
      if (dependencyObj.isEqualTo(d)) {
        return true;
      } else if (d.hasDependency(dependencyObj, true)) {
        return true;
      }
    }
    return false;
  }

};

module.exports = DependencyTree;