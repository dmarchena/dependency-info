(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Dependency = require(path.join(rootDir, '/lib/dependency.js')),
    dependencyFactory = require(path.join(rootDir, '/lib/dependency-factory.js')),
    dependencyInfo = require(path.join(rootDir, '/lib/'));
    
describe('DependencyTree in NPM:', function () {

  var bluebird = dependencyFactory.createDependency(
        path.join(testDataDir, '/node_modules/bluebird/'),
        'npm'),
      gulp = dependencyFactory.createDependency(
        path.join(testDataDir, '/node_modules/gulp/'),
        'npm'),
      chalk = dependencyFactory.createDependency(
        path.join(testDataDir, '/node_modules/gulp/node_modules/gulp-util/node_modules/chalk/'),
        'npm'),
      extend = dependencyFactory.createDependency(
        path.join(testDataDir, '/node_modules/extend/'),
        'npm'),
      searchRootPath = testDataDir,
      tree = dependencyInfo.readTreeSync({ 
        path: searchRootPath 
      });

  it('should return a tree of Dependency objects', function () {
    (tree.dependencies[0]).should.be.an.instanceOf(Dependency);
  });

  it('should return all dependencies if deep equal to true', function (done) {
    dependencyInfo.readTree({ 
      path: searchRootPath,
      deep: true
    })
    .then(function (tree) {
      (tree.contains(chalk)).should.be.equal(true);
      done();
    })
    .catch(function (err) {
      done(err);
    });
  });

  it('should filter dependencies by its keywords', function () {
    var dependencyWillFind = extend,
        dependencyWontFind = bluebird,
        tree = dependencyInfo.readTreeSync({ 
          path: searchRootPath,
          filterBy: {
            keyword: 'clone'
          }
        });

    (tree.contains(dependencyWillFind)).should.be.equal(true);
    (tree.contains(dependencyWontFind)).should.be.equal(false);
  });

  it('should filter async dependencies by its keywords', function (done) {
    var dependencyWillFind = extend,
        dependencyWontFind = bluebird;

    dependencyInfo.readTree({ 
      path: searchRootPath,
      filterBy: {
        keyword: 'clone'
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
    var dependencyWillFind = bluebird,
        dependencyWontFind = gulp,
        prodTree;

    prodTree = dependencyInfo.readTreeSync({ 
      path: searchRootPath, 
      type: ['dependencies'] 
    });

    (prodTree.contains(dependencyWillFind)).should.be.equal(true);
    (prodTree.contains(dependencyWontFind)).should.be.equal(false);
  });

  it('should only retrieve dev dependencies', function (done) {
    var dependencyWillFind = gulp,
        dependencyWontFind = bluebird;
        
    dependencyInfo.readTree({ 
      path: searchRootPath, 
      type: ['devDependencies']
    })
    .then(function(devTree){
      (devTree.contains(dependencyWillFind)).should.be.equal(true);
      (devTree.contains(dependencyWontFind)).should.be.equal(false);
      done();
    });
  });

});

}());