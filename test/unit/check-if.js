(function () {
'use strict';

describe('CheckIf unit test', function () {
  var path = require('path'),
      testDir = __dirname,
      dataDir = path.join(testDir,'/data/'),
      ConfigJson = require('../../lib/json/config-json.js'),
      configJsonFactory = require('../../lib/json/config-json-factory.js'),
      checkIf;

	beforeEach(function () {
    checkIf = require('../../lib/search/check-if.js')();
  });

  describe('configJson()', function () {
    it('should assign a ConfigJson to its property configJsonObj from the config file path', function () {
      checkIf.configJson(path.join(dataDir, '/bower.json'), 'bower');
      (checkIf.configJsonObj).should.be.an.instanceOf(ConfigJson);
    });
  });

  describe('bowerJson()', function () {
    it('should throw an error if source is undefined', function (done) {
      try {
        checkIf.bowerJson();
      } catch(err) {
        (err.message).should.startWith('"source" param is required.');
        done();
      }
    });
    it('should throw an error if source is neither a BowerJson nor a string', function (done) {
      try {
        checkIf.bowerJson(path);
      } catch(err) {
        (err.message).should.startWith('Unknown source');
        done();
      }
    });
    it('should assign a ConfigJson to its property configJsonObj from the config file path', function () {
      checkIf.bowerJson(path.join(dataDir, '/bower.json'));
      (checkIf.configJsonObj).should.be.an.instanceOf(ConfigJson);
    });
    it('should assign the BowerJson passed as a source to its property configJsonObj', function () {
      var bowerJson = configJsonFactory.createConfigJson(dataDir, 'bower'); // Created from its base dir
      checkIf.bowerJson(bowerJson);
      (checkIf.configJsonObj).should.be.equal(bowerJson);
    });
  });

  describe('packageJson()', function () {
    it('should throw an error if source is undefined', function (done) {
      try {
        checkIf.packageJson();
      } catch(err) {
        (err.message).should.startWith('"source" param is required.');
        done();
      }
    });
    it('should throw an error if source is neither a PackageJson nor a string', function (done) {
      try {
        checkIf.packageJson(path);
      } catch(err) {
        (err.message).should.startWith('Unknown source');
        done();
      }
    });
    it('should assign a ConfigJson to its property configJsonObj from the base dir path', function () {
      checkIf.packageJson(path.join(dataDir, '/package.json'));
      (checkIf.configJsonObj).should.be.an.instanceOf(ConfigJson);
    });
    it('should assign the PackageJson passed as a source to its property configJsonObj', function () {
      var packageJson = configJsonFactory.createConfigJson(path.join(dataDir), 'npm'); // Created from its base dir
      checkIf.packageJson(packageJson);
      (checkIf.configJsonObj).should.be.equal(packageJson);
    });
  });

  describe('passesTheFilter()', function () {
    var packageJson = configJsonFactory.createConfigJson(path.join(dataDir, '/package.json'), 'npm');

    it('should throw an error if property configJsonObj has not been initialized', function (done) {
      try {
        checkIf.passesTheFilter({
          keyword: 'jquery'
        });
      } catch(err) {
        (err.message).should.startWith('this.configJsonObj is not defined');
        done();
      }
    });
    it('should return true if param is undefined', function () {
      (checkIf.packageJson(packageJson).passesTheFilter()).should.be.equal(true);
    });
    it('should return false if configJson has not the keyword', function () {
      var filterBy = {
        keyword: 'dependency'
      };
      (checkIf.packageJson(packageJson).passesTheFilter(filterBy)).should.be.equal(true);
    });
    it('should return true if configJson has the keyword', function () {
      var filterBy = {
        keyword: 'dependency'
      };
      (checkIf.packageJson(packageJson).passesTheFilter(filterBy)).should.be.equal(true);
    });
    it('should return true if configJson has all the keywords', function () {
      var filterBy = {
        keyword: ['dependency', 'npm', 'bower']
      };
      (checkIf.packageJson(packageJson).passesTheFilter(filterBy)).should.be.equal(true);
    });
  });

});

}());