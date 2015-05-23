(function () {
'use strict';

describe('ConfigJsonFactory unit test', function () {
  var path = require('path'),
      testDir = __dirname,
      dataDir = path.join(testDir,'/data/'),
      configJsonFactory = require('../../lib/json/config-json-factory.js');

  describe('createConfigJson()', function () {
    it('should return a valid ConfigJson', function () {
      var configJson = configJsonFactory.createConfigJson(dataDir, 'npm');
      (configJson.content.name).should.be.equal('dependency-info');
    });
  });

  describe('Readability upgrades: returned ConfigJson', function () {
    var configJson = configJsonFactory.createConfigJson(dataDir, 'bower');

    it('should permit to use "has.keyword()" to check whether it contains a specified keyword', function () {
      (configJson.has.keyword('jquery')).should.be.equal(true);
      (configJson.has.keyword('mootools')).should.be.equal(false);
    });
    it('should permit to use "has.not.keyword()" to check whether it contains a specified keyword', function () {
      (configJson.has.not.keyword('python')).should.be.equal(true);
      (configJson.has.not.keyword('javascript')).should.be.equal(false);
    });
  });

});

}());