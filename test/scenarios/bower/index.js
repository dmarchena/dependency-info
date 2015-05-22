(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Dependency = require(path.join(rootDir, '/lib/dependency.js')),
    dependencyInfo = require(path.join(rootDir, '/lib/'));
    
describe('DependencyTree in Bower:', function () {

  var jquery = new Dependency(
        path.join(testDataDir, '/bower_components/jquery/'),
        'bower'),
      bootstrap = new Dependency(
        path.join(testDataDir, '/bower_components/bootstrap/'),
        'bower'),
      jqueryFileUpload = new Dependency(
        path.join(testDataDir, '/bower_components/jquery-file-upload/'),
        'bower'),
      searchRootPath = testDataDir,
      tree = dependencyInfo.readTreeSync({ 
        path: searchRootPath,
        manager: 'bower',
        type: ['dependencies']
      });

  it('should return a tree of Dependency objects', function () {
    (tree.dependencies[0]).should.be.an.instanceOf(Dependency);
  });

  it('should return all dependencies', function () {
    //console.log(tree.dependencies[1].dependencies[0].dependencies);
    (tree.contains(jquery)).should.be.equal(true);
  });

  it('should filter dependencies by its keywords', function () {
    var dependencyWillFind = jquery,
        dependencyWontFind = bootstrap,
        tree = dependencyInfo.readTreeSync({ 
          path: searchRootPath,
          manager: 'bower',
          type: ['dependencies'],
          filterBy: {
            keyword: 'jquery'
          }
        });

    (tree.contains(dependencyWillFind)).should.be.equal(true);
    (tree.contains(dependencyWontFind)).should.be.equal(false);
  });

  it('should filter async dependencies by its keywords', function (done) {
    var dependencyWillFind = jquery,
        dependencyWontFind = bootstrap;

    dependencyInfo.readTree({ 
      path: searchRootPath,
      manager: 'bower',
      type: ['dependencies'],
      filterBy: {
        keyword: 'jquery'
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

  it('should throw an Error if cannot find a dependency config file', function (done) {
    dependencyInfo.readTree({ 
      path: searchRootPath,
      //type: ['devDependencies'],
      manager: 'bower'
    })
    .catch(function (err) {
      (err.message).should.startWith('File not found');
      done();
    });
  });

  it('should throw an Error with a unsupported manager', function (done) {
    dependencyInfo.readTree({ 
      path: searchRootPath,
      //type: ['devDependencies'],
      manager: 'foo'
    })
    .catch(function (err) {
      (err.message).should.startWith('Unknown manager');
      done();
    });
  });

});

}());