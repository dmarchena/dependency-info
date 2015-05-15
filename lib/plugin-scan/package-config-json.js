'use strict';

function PackageConfigJson(filePath) {
  try {
    this.json = require(filePath);
  } catch(e) {
    console.log('PackageConfigJson.constructor: File not found');
  }
}

PackageConfigJson.prototype = {
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
  PackageConfigJson.apply(this, arguments);
}
BowerJson.prototype = Object.create(PackageConfigJson.prototype);  
BowerJson.prototype.constructor = BowerJson;  


function PackageJson() {
  PackageConfigJson.apply(this, arguments);
}
PackageJson.prototype = Object.create(PackageConfigJson.prototype);  
PackageJson.prototype.constructor = PackageJson;  


function PackageConfigJsonFactory() {}

PackageConfigJsonFactory.prototype = (function () {

  var createPackageConfigJson = function createPackageConfigJson(packageManager, filePath) {
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

    jsonObject = new PackageConfigJson(filePath);

    // Readability upgrades
    jsonObject.has = {
      keyword: function (k) { return jsonObject.hasKeyword(k); },
      not: {
        keyword:  function (k) { return !jsonObject.hasKeyword(k); }
      }
    };

    return jsonObject;
  }

  return {
    createPackageConfigJson: createPackageConfigJson
  }

}());

module.exports.factory = new PackageConfigJsonFactory();
