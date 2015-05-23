/* jshint node: true */
'use strict';

var BowerJson = require('./bower-json.js'),
    PackageJson = require('./package-json.js');

function ConfigJsonFactory() {}

ConfigJsonFactory.prototype = (function () {

  /**
   * Creates a new ConfigJson. 
   * It will be a instance of BowerJson or PackageJson, depending on the specified 
   * packageManager.
   * @param  {String} filePath        Path to package dir or json file
   * @param  {String} packageManager  'npm' or 'bower'
   * @return {ConfigJson}             The ConfigJson which wraps the json file related to path
   */
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

    /* 
    Readability upgrade:
    - instance.has.keyword()
    - instance.has.not.keyword()
    */
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