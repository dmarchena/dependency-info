/* jshint node: true */
'use strict';

var extend = require('extend'),
    search = require('./search'),
    stable = require('stable');

function DependencyTree() {}

DependencyTree.prototype = (function(){
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
  var init = function(options, callback) {
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
  };

  /**
   * Returns true if Dependency passed is in the tree
   *  
   * @param  {Dependency} dependencyObj the depencency to search for
   * @return {boolean}               true is returned if this tree contains dependencyObj, else false.
   */
  var contains = function contains(dependencyObj) {
    for (var i=0, length = this.dependencies.length; i<length; i++) {
      var d = this.dependencies[i];
      if (dependencyObj.isEqualTo(d)) {
        return true;
      } else if (d.hasDependency(dependencyObj, true)) {
        return true;
      }
    }
    return false;
  };

  /**
   * This method looks over the tree and returns an ordered array of key value objects
   * filled with the specified fields, which will be taken from each dependency json file.
   * @param  {Array} fields   The fields to get from json files
   * @param  {String} order   Sort dependencies in ascending ('asc') or descending order ('desc')
   * @return {Array}          The method return an array of key value objects
   */
  var list = function list(fields, order) {
    var arr = toArray.call(this, order),
        result = [],
        isFieldsAnArray = Object.prototype.toString.call(fields) === '[object Array]';

    if (isFieldsAnArray && fields.length > 0) {
      arr.forEach(function (dep) {
        var entry = {};
        fields.forEach(function (f) {
          if (f == 'path') {
            entry[f] = dep.path; 
          } else {
            entry[f] = dep.json[f]; 
          }
        });
        result.push(entry);
      });
    } else {
      arr.forEach(function (dep) {
        result.push(dep.json);
      });
    }

    return result;
  };

  /**
   * This method looks over the tree and returns an array of Dependency objects.
   * If order is equal to 'desc', the dependencies will be sorted from direct 
   * ones to their dependencies.
   * Otherwise, if it is equal to 'asc', the array will begin by the most 
   * deep dependencies. 
   * There won't be duplicate entries.
   * 
   * @param  {String} order 'asc' or 'desc'
   * @return {Array}        A one-dimensional array of sorted tree dependencies
   */
  var toArray = function toArray(order) {
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
    
    arr = removeDuplicates(arr);

    arr = stable(arr, function (a, b) {
      if (order === 'asc') {
        return a.compare(b);
      } else {
        return a.compare(b) * -1;
      }
    });

    return arr;
  };

  return {
    init: init,
    contains: contains,
    list: list
  };

}());

module.exports = DependencyTree;