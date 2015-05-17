/* jshint node: true */
'use strict';
 
var SearchEngine = require('./search-engine.js');
 
function search(tree) {
  var searchEngine = new SearchEngine(tree);
  return searchEngine.fetchDependencies(tree.path);
}
 
module.exports = search;
