(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Dependency = require(path.join(rootDir, '/lib/dependency.js')),
    dependencyInfo = require(path.join(rootDir, '/lib/'));
    
describe('DependencyTree', function () {

  var module1 = new Dependency('module-1', path.join(testDataDir, '/node_modules/module-1/')),
      module2 = new Dependency('module-2', path.join(testDataDir, '/node_modules/module-2/')),
      module3 = new Dependency('module-3', path.join(testDataDir, '/node_modules/module-3/')),
      searchRootPath = testDataDir,
      tree = dependencyInfo.createTree({ 
        path: searchRootPath 
      }),
      filteredTree = dependencyInfo.createTree({ 
        path: searchRootPath,
        filterBy: {
          keyword: 'search-target'
        }
      }),
      prodTree = dependencyInfo.createTree({ 
        path: searchRootPath, 
        type: ['dependencies'] 
      }),
      devTree = dependencyInfo.createTree({ 
        path: searchRootPath, 
        type: ['devDependencies'] 
      });

  it('should be an array', function () {
    (tree.dependencies).should.be.an.instanceOf(Array);
  });

  if (tree.dependencies.length>0) {
    it('should return an array of Dependency objects', function () {
      (tree.dependencies[0]).should.be.an.instanceOf(Dependency);
    });
  }

  it('should filter dependencies by its keywords', function () {
    var dependencyWillFind = module2,
        dependencyWontFind = module3;

    (filteredTree.contains(dependencyWillFind)).should.be.equal(true);
    (filteredTree.contains(dependencyWontFind)).should.be.equal(false);
  });

  it('should only retrieve production dependencies', function () {
    var dependencyWillFind = module1,
        dependencyWontFind = module2;

    (prodTree.contains(dependencyWillFind)).should.be.equal(true);
    (prodTree.contains(dependencyWontFind)).should.be.equal(false);
  });

  it('should only retrieve dev dependencies', function () {
    var dependencyWillFind = module2,
        dependencyWontFind = module1;

    (devTree.contains(dependencyWillFind)).should.be.equal(true);
    (devTree.contains(dependencyWontFind)).should.be.equal(false);
  });

});

}());