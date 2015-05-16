/* jshint node: true */
'use strict';

function ConfigJson(filePath) {
  try {
    this.json = require(filePath);
  } catch(e) {
    console.log('ConfigJson.constructor: File not found');
  }
}

ConfigJson.prototype = {
  hasKeyword: function hasKeyword(keyword){
    for (var i=0, length=(this.json.keywords)?this.json.keywords.length:0; i<length; i++){
      if(this.json.keywords[i]==keyword){
        return true;
      }
    }
    return false;
  }
};


function BowerJson() {
  ConfigJson.apply(this, arguments);
}
BowerJson.prototype = Object.create(ConfigJson.prototype);  
BowerJson.prototype.constructor = BowerJson;  


function PackageJson() {
  ConfigJson.apply(this, arguments);
}
PackageJson.prototype = Object.create(ConfigJson.prototype);  
PackageJson.prototype.constructor = PackageJson;  


function ConfigJsonFactory() {}

ConfigJsonFactory.prototype = (function () {

  var createConfigJson = function createConfigJson(packageManager, filePath) {
    var configClass,
        jsonObject;

    if (packageManager === 'bower') {
      configClass = BowerJson;
    } else if (packageManager === 'npm') {
      configClass = PackageJson;
    }
    
    if (configClass === null) {
      return false;
    }

    jsonObject = new ConfigJson(filePath);

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

module.exports.factory = new ConfigJsonFactory();
