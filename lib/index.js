/* jshint node: true */
'use strict';

var DependencyTree = require('./tree.js'),
    Promise = require('bluebird');

/**
 * Read the dependency tree asynchronously. 
 * It will be retrieved from the main project or the given module path.
 *
 * Options format: 
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
 *       keyword:      {array} 
 *     }
 *   }
 * 
 * @param  {Object}   options  Tree configuration
 * @param  {Function} callback The method will call this function afterwards
 */
var readTree = function readTree(options, callback) {
  var tree = new DependencyTree();
  tree.init(options, callback);
};

/**
 * Read the dependency tree synchronously. 
 * It will be retrieved from the main project or the given module path.
 *
 * Options format: 
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
 *       keyword:      {array} 
 *     }
 *   }
 * 
 * @param  {Object}   options  Tree configuration
 * @return {Tree}              Tree 
 */
var readTreeSync = function readTreeSync(options) {
  var tree = new DependencyTree();
  tree.init(options);
  return tree;
};

module.exports = {
  // Bluebird will wrap 'readTree' and it will return a promise
  readTree: Promise.promisify(readTree),
  readTreeSync: readTreeSync
};