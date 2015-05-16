/* jshint node: true */
'use strict';
 
var SearchEngine = require('./search-engine.js');
 
function search(options) {
  var searchEngine = new SearchEngine(options);
  return searchEngine.fetchDependencies(options.path);
}
 
module.exports = search;
