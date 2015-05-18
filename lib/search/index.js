/* jshint node: true */
'use strict';
 
var SearchEngine = require('./search-engine.js');
 
function search(tree, callback) {
  var searchEngine = new SearchEngine(tree);

  if(typeof callback === 'function') {
  	searchEngine.fetchDependencies(tree.path, callback);
  } else {
  	return searchEngine.fetchDependencies(tree.path);
  }
}
 
module.exports = search;
