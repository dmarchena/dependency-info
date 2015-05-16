/* jshint node: true */
'use strict';
 
var SearchEngine = require('./search-engine.js');
 
function search(searchRootPath, dependencyType) {
  var searchEngine = new SearchEngine({
    type: dependencyType
  });
  return searchEngine.fetchDependencies(searchRootPath);
}
 
module.exports = search;
