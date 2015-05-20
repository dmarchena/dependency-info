/* jshint node: true */
'use strict';

var BowerJson = require('./bower-json.js'),
	PackageJson = require('./package-json.js');

function ConfigJsonFactory() {}

ConfigJsonFactory.prototype = (function () {

  var createConfigJson = function createConfigJson(filePath, packageManager) {
    var ConfigClass,
        jsonObject;
    
    if (packageManager === 'bower') {
      ConfigClass = BowerJson;
    } else if (packageManager === 'npm') {
      ConfigClass = PackageJson;
    }
    
    /*
    tree.js validates this:
    if (ConfigClass === null) {
      return false;
    }
    */

    jsonObject = new ConfigClass({
      path: filePath
    });

    // Readability upgrades
    jsonObject.has = {
      keyword: function (k) { return jsonObject.hasKeyword(k); },
      not: {
        keyword:  function (k) { return !jsonObject.hasKeyword(k); }
      }
    };

    return jsonObject;
  };

  return {
    createConfigJson: createConfigJson
  };

}());

module.exports = new ConfigJsonFactory();