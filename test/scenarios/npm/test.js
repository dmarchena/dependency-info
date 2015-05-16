(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Dependency = require(path.join(rootDir, '/lib/dependency.js')),
    dependenciesInfo = require(path.join(rootDir, '/lib/'));
    
describe('NPM Dependency search:', function () {

  var dependencyWillFind = new Dependency('module-1', path.join(testDataDir, '/node_modules/module-1/')),
      dependencyWontFind = new Dependency('module-3', path.join(testDataDir, '/node_modules/module-3/')),
      searchRootPath = testDataDir,
      dependencies = dependenciesInfo({ path: searchRootPath });

  it('should return an array', function () {
    (dependencies).should.be.an.instanceOf(Array);
  });

  if (dependencies.length>0) {
    it('should return an array of Dependency objects', function () {
      (dependencies[0]).should.be.an.instanceOf(Dependency);
    });
  }

  it('should filter dependencies by its keywords', function () {
    var arrayContainsDependencyWithKeyword = false,
        arrayContainsDependencyWithoutKeyword = false;
    for (var i=0, length = dependencies.length; i<length; i++) {
      var p = dependencies[i];
      if (dependencyWillFind.isEqualTo(p)) {
        arrayContainsDependencyWithKeyword = true;
      }
      if (dependencyWontFind.isEqualTo(p)) {
        arrayContainsDependencyWithoutKeyword = true;
      }
    }
    (arrayContainsDependencyWithKeyword).should.be.equal(true);
    (arrayContainsDependencyWithoutKeyword).should.be.equal(false);
  });

});

}());