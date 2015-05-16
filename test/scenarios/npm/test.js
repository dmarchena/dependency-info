(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Dependency = require(path.join(rootDir, '/lib/dependency.js')),
    pluginScan = require(path.join(rootDir, '/lib/search'));
    
describe('NPM Dependency search:', function () {

  var nonPlugin = new Dependency('non-arin-plugin', path.join(testDataDir, '/node_modules/non-arin-plugin/')),
      plugin = new Dependency('arin-plugin', path.join(testDataDir, '/node_modules/arin-plugin/')),
      scannerRootPath = testDataDir,
      dependencies = pluginScan(scannerRootPath);

  it('should return an array', function(){
    (dependencies).should.be.an.instanceOf(Array);
  });

  if(dependencies.length>0){
    it('should return an array of Dependency objects', function () {
      (dependencies[0]).should.be.an.instanceOf(Dependency);
    });
  }

  it('should filter dependencies by its keywords', function () {
    var arrayContainsPlugin = false,
        arrayContainsNonPlugin = false;
    for (var i=0, length = dependencies.length; i<length; i++) {
      var p = dependencies[i];
      if (plugin.isEqualTo(p)) {
        arrayContainsPlugin = true;
      }
      if (nonPlugin.isEqualTo(p)) {
        arrayContainsNonPlugin = true;
      }
    }
    (arrayContainsPlugin).should.be.equal(true);
    (arrayContainsNonPlugin).should.be.equal(false);
  });

});

}());