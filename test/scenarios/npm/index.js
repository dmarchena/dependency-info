(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Dependency = require(path.join(rootDir, '/lib/dependency.js')),
    dependencyInfo = require(path.join(rootDir, '/lib/'));
    
describe('DependencyTree in NPM:', function () {

  var module1 = new Dependency(
        path.join(testDataDir, '/node_modules/module-1/'),
        'npm'),
      module2 = new Dependency(
        path.join(testDataDir, '/node_modules/module-2/'),
        'npm'),
      module2_1_1 = new Dependency(
        path.join(testDataDir, '/node_modules/module-2/node_modules/module-2-1/node_modules/module-2-1-1/'),
        'npm'),
      module3 = new Dependency(
        path.join(testDataDir, '/node_modules/module-3/'),
        'npm'),
      searchRootPath = testDataDir,
      tree = dependencyInfo.readTreeSync({ 
        path: searchRootPath 
      }),
      devTree = dependencyInfo.readTreeSync({ 
        path: searchRootPath, 
        type: ['devDependencies'] 
      });

  it('should return a tree of Dependency objects', function () {
    (tree.dependencies[0]).should.be.an.instanceOf(Dependency);
  });

  it('should return all dependencies', function () {
    //console.log(tree.dependencies[1].dependencies[0].dependencies);
    (tree.contains(module2_1_1)).should.be.equal(true);
  });

  it('should filter dependencies by its keywords', function () {
    var dependencyWillFind = module2,
        dependencyWontFind = module3,
        tree = dependencyInfo.readTreeSync({ 
          path: searchRootPath,
          filterBy: {
            keyword: 'search-target'
          }
        });

    (tree.contains(dependencyWillFind)).should.be.equal(true);
    (tree.contains(dependencyWontFind)).should.be.equal(false);
  });

  it('should filter async dependencies by its keywords', function (done) {
    var dependencyWillFind = module2,
        dependencyWontFind = module3;

    dependencyInfo.readTree({ 
      path: searchRootPath,
      filterBy: {
        keyword: 'search-target'
      }
    })
    .then(function (tree) {
      (tree.contains(dependencyWillFind)).should.be.equal(true);
      (tree.contains(dependencyWontFind)).should.be.equal(false);
      done();
    })
    .catch(function (err) {
      console.log("Error reading dependency tree", err);
    });
  });

  it('should only retrieve production dependencies', function () {
    var dependencyWillFind = module1,
        dependencyWontFind = module2,
        prodTree;

    prodTree = dependencyInfo.readTreeSync({ 
      path: searchRootPath, 
      type: ['dependencies'] 
    });

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