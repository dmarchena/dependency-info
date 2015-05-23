(function () {
'use strict';

describe('ConfigJson unit test', function () {
  var path = require('path'),
      testDir = __dirname,
      dataDir = path.join(testDir,'/data/'),
      ConfigJson = require('../../lib/json/config-json.js');

  describe('constructor()', function () {
    it('should throw an error if path is undefined', function (done) {
      var configJson;
      try {
        configJson = new ConfigJson();
      } catch(err) {
        (err.message).should.startWith('You have to pass the "path" to JSON file.');
      }
      try {
        configJson = new ConfigJson({
          path: '',
          defaultFilename: 'bower.json'
        });
      } catch(err) {
        (err.message).should.startWith('You have to pass the "path" to JSON file.');
      }
      done();
    });
    it('should throw an error if path points to a dir and default file name is undefined', function (done) {
      var configJson;
      try {
        configJson = new ConfigJson({
          path: dataDir
        });
      } catch(err) {
        (err.message).should.startWith('"path" points to a directory, but I cannot find any "defaultFilename" in options.');
        done();
      }
    });
    it('should throw an error if json file is not found', function (done) {
      var configJson;
      try {
        configJson = new ConfigJson({
          path: testDir,
          defaultFilename: 'bower.json'
        });
      } catch(err) {
        (err.message).should.startWith('File not found');
        done();
      }
    });
    it('should return a valid ConfigJson passing a path to file', function () {
      var configJson;
      configJson = new ConfigJson({
        path: path.join(dataDir, '/bower.json')
      });
      (configJson.content.name).should.be.equal('jquery');
    });
    it('should return a valid ConfigJson passing a dir path and a default file name', function () {
      var configJson;
      configJson = new ConfigJson({
        path: dataDir, 
        defaultFilename: '/package.json'
      });
      (configJson.content.name).should.be.equal('dependency-info');
    });
  });

  describe('hasKeyword()', function () {
    var configJson;
    configJson = new ConfigJson({
      path: dataDir, 
      defaultFilename: '/bower.json'
    });

    it('should return true if json contains the given keyword', function () {
      (configJson.hasKeyword('javascript')).should.be.equal(true);
    });
    it('should return false if json doesn\'t contain the given keyword', function () {
      (configJson.hasKeyword('python')).should.be.equal(false);
    });
  });

});

}());