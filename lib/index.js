/* jshint node: true */
'use strict';

var extend = require('extend'),
    search = require('./search');

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
function dependenciesInfo(options) {
  var default_options = {
        path: process.cwd(), 
        manager: 'npm',
        type: 'all',
        filterBy: {} 
      },
      opts = extend(true, {}, default_options, options);
      
  if (opts.manager !== 'npm' && opts.manager !== 'bower') {
    throw new Error('Unknown manager: ' + opts.manager + ' ("npm" or "bower" accepted only)', 'index.js', 37);
  }

  return search(opts);

}

module.exports = dependenciesInfo;