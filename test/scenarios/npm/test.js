(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Dependency = require(path.join(rootDir, '/lib/dependency.js')),
    dependenciesInfo = require(path.join(rootDir, '/lib/'));

function isDependencyInTree(dependencyObj, tree) {
  for (var i=0, length = tree.length; i<length; i++) {
    var p = tree[i];
    if (dependencyObj.isEqualTo(p)) {
      return true;
    }
  }
  return false;
}
    
describe('NPM Dependency search:', function () {

  var module1 = new Dependency('module-1', path.join(testDataDir, '/node_modules/module-1/')),
      module2 = new Dependency('module-2', path.join(testDataDir, '/node_modules/module-2/')),
      module3 = new Dependency('module-3', path.join(testDataDir, '/node_modules/module-3/')),
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
    var dependencyWillFind = module2,
        dependencyWontFind = module3;

    (isDependencyInTree(dependencyWillFind, dependencies)).should.be.equal(true);
    (isDependencyInTree(dependencyWontFind, dependencies)).should.be.equal(false);
  });

  it('should only retrieve production dependencies', function () {
    var dependencyWillFind = module1,
        dependencyWontFind = module2,
        productionDependencies = dependenciesInfo({ path: searchRootPath, type: ['dependencies'] });

    (isDependencyInTree(dependencyWillFind, productionDependencies)).should.be.equal(true);
    (isDependencyInTree(dependencyWontFind, productionDependencies)).should.be.equal(false);
  });

});

}());