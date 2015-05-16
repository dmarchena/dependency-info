/* jshint node: true */
'use strict';

var pluginScan = require('./plugin-scan'),
    rootPath = process.cwd(),
    PluginManager;

PluginManager = (function(){

  var fetchAll = function () {
    return pluginScan(rootPath);
  };

  return {
    fetchAll: fetchAll
  };

}());

module.exports = PluginManager;