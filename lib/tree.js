/* jshint node: true */
'use strict';

var extend = require('extend'),
    search = require('./search'),
    stable = require('stable'),
    arrayUniq = require('array-uniq');

function DependencyTree() {}

DependencyTree.prototype = {
  /**
   * Retrieves a tree of Dependency objects
   * @param  {object} options     search config
   *   {
   *     path:           {string}  path to module whose dependencies will be fetched. (default: process.cwd()) 
   *     manager:        {string}  'npm' (default) or 'bower'
   *     type:           {string}  'all' (default)
   *                     or
   *                     {array}   Accepted values: 'dependencies' and 'devDependencies'
   *     deep:           {Boolean} If true it will scan all dependencies, not only the direct ones. 
   *                               Default value: false
   *     filterBy:       {object}
   *     {
   *       keyword:     {array} 
   *     }
   *   }
   * @return {Array}              tree of Dependency objects
   */
  init: function(options, callback) {
    var default_options = {
          path: process.cwd(), 
          manager: 'npm',
          type: 'all',
          deep: false,
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

    /*
    If type == 'all' or is empty the tree would contain 
    production dependencies as well as development ones
     */
    if (isTypeAnStringEqualToAll || isTypeAnEmptyArray) {
      opts.type = ['dependencies', 'devDependencies'];
    }

    self.path = opts.path;
    self.dependenciesManager = opts.manager;
    self.dependenciesType = opts.type;
    self.filterBy = opts.filterBy;

    if (typeof callback === 'function'){
      /*
      Wrap the user's promisified callback in a function that assigns 
      search results to property 'dependencies'.
      The initial callback will be called afterwards.
      Params:
      null (promise error), tree object (promise data).
       */
      try {
        search(self, options.deep, function (dependencies) {
          self.dependencies = dependencies;
          callback.call(self, null, self);
        });
      } catch(err) {
        /*
        In case of an error, the promisified callback will be called.
        Params: err (promise error), null (promise data).
         */
        callback.call(self, err, null);
      }
    } else {
      self.dependencies = search(self, options.deep);
    }
  },

  /**
   * Returns true if Dependency passed is in the tree
   *  
   * @param  {Dependency} dependencyObj the depencency to search for
   * @return {boolean}               true is returned if this tree contains dependencyObj, else false.
   */
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
  },

  list: function list() {
    var sorted = stable(this.toArray(), function (a, b) {
      return a.compare(b);
    });
    //var sorted = this.toArray();
    for (var i = 0, length = sorted.length; i < length; i++) {
      console.log(sorted[i].name);
    }
  },

  toArray: function toArray() {
    var arr = [];

    function removeDuplicates(arr){
      var result = {};
      arr.forEach(function (d) {
        result[d.name] = d;
      });
      arr = [];
      for (var k in result) {
        arr.push(result[k]);
      }
      return arr;
    }

    this.dependencies.forEach(function (d) {
      arr = arr.concat(d.getDependencyArray());
      arr.push(d);
    });
    
    return removeDuplicates(arr);
  }

};

module.exports = DependencyTree;