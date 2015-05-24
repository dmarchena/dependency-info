/* jshint node: true */
'use strict';
 
var SearchEngine = require('./search-engine.js');
 
function search(tree, deep, callback) {
  var searchEngine = new SearchEngine(tree);

  if(typeof callback === 'function') {
  	searchEngine.fetchDependencies(tree.path, deep, callback);
  } else {
  	return searchEngine.fetchDependencies(tree.path, deep, callback);
  }
}
 
module.exports = search;
