
'use strict';

var Plugin = require('../plugin.js'),
    packageConfigJsonFactory = require('./package-config-json.js').factory,
    checkIf = require('./check-if.js'),
    path = require('path');

function NpmScanner() {
}

NpmScanner.prototype = (function () {

  /**
   * Scan for dependencies
   * 
   * @param  {Plugin} plugin          Target plugin
   * @param  {Plugin} parentPlugin?   Target plugin's parent
   * @param  {String} filter?         Package.json query to verify
   * @return {Plugin}                 Main Arin dependency
   */
  var scan = function scan(plugin, parentPlugin) {

    var jsonPath = path.join(plugin.path, '/package'),
        packageJson = packageConfigJsonFactory.createPackageConfigJson('npm', jsonPath),
        depName,
        depPath,
        isNotMainScan = (parentPlugin instanceof Plugin);

    if (packageJson === null) {
      return null;
    }

    if (isNotMainScan && checkIf.packageJson(packageJson).has.not.keyword('arin-plugin')) {
      return null;
    }

    if (plugin instanceof Plugin) {
      for (var k in packageJson.json.devDependencies) {
        depName = k;
        depPath = path.join(plugin.path, 'node_modules', k);
        scan.call(this, new Plugin(depName, depPath), plugin);
      }
      if (parentPlugin instanceof Plugin) {
        parentPlugin.addDependency(plugin);
      }
    }

    return plugin;

  };

  var fetchArinPlugins = function fetchArinPlugins(rootPath) {
    var scanParentModule = scan.call(this, new Plugin('scanParentModule', rootPath));
    return scanParentModule.arinDependencies;
  };

  return {
    fetchArinPlugins: fetchArinPlugins
  };

}());

module.exports = NpmScanner;



