(function() { 
'use strict';

var path = require('path'),
    rootDir = process.cwd(),
    scenarioDir = __dirname,
    testDataDir = path.join(scenarioDir, '/data/'),
    Plugin = require(path.join(rootDir, '/lib/plugin.js')),
    checkIf = require(path.join(rootDir, '/lib/plugin-scan/check-if.js')),
    pluginScan = require(path.join(rootDir, '/lib/plugin-scan'));
    
describe('Dependency scanning:', function () {

  describe('npmPackageCheckIf', function () {
    var arinPluginPackageJsonPath = path.join(testDataDir, '/node_modules/arin-plugin/package');
    it('should return true if a PackageJson has a keyword', function () {
      (checkIf.packageJson(arinPluginPackageJsonPath).has.keyword('arin-plugin')).should.be.equal(true);
    });

    it('should return false if a PackageJson has not a keyword', function () {
      (checkIf.packageJson(arinPluginPackageJsonPath).has.keyword('wontfound')).should.be.equal(false);
    });

  });

  describe('npmPackageScanner.fetchArinPlugins()', function () {
    var nonPlugin = new Plugin('non-arin-plugin', path.join(testDataDir, '/node_modules/non-arin-plugin/')),
        plugin = new Plugin('arin-plugin', path.join(testDataDir, '/node_modules/arin-plugin/')),
        scannerRootPath = testDataDir,
        dependencies = pluginScan(scannerRootPath);

    it('should return an array', function(){
      (dependencies).should.be.an.instanceOf(Array);
    });

    if(dependencies.length>0){
      it('should return an array of Plugin objects', function () {
        (dependencies[0]).should.be.an.instanceOf(Plugin);
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

});

}());