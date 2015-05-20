/* jshint node: true */
'use strict';

var BowerJson = require('../json/bower-json.js'),
    PackageJson = require('../json/package-json.js'),
    configJsonFactory = require('../json/config-json-factory.js');

function CheckIf() {}

CheckIf.prototype = {

  configJson: function (source, configManager) {
    if (configManager === 'bower') {
      this.bowerJson(source);
    } else if (configManager === 'npm') {
      this.packageJson(source);
    }
    /*
    tree.js validates this:
    else {
      throw new TypeError('Unknown configManager: ' + configManager, 'check-if.js');
    }
    */
    return this;
  },

  /**
   * Adds readability to BowerJson filters.
   * If source param is a path, returns a new BowerJson object. 
   * @param  {} source [description]
   * @return {BowerJson}        [description]
   */
  bowerJson: function checkIfBowerJson(source) {
    if (typeof source === 'undefined') {
      throw new Error('"source" param is required.', 'check-if.js');
    }
    if (source instanceof BowerJson) {
      this.configJsonObj = source;
    } else if (typeof source === 'string') {
      this.configJsonObj = configJsonFactory.createConfigJson('bower', source);
    } else {
      throw new TypeError('Unknown source: ' + source, 'check-if.js');
    }
    return this;
  },

  packageJson: function checkIfPackageJson(source) {
    if (typeof source === 'undefined') {
      throw new Error('"source" param is required.', 'check-if.js');
    }
    if (source instanceof PackageJson) {
      this.configJsonObj = source;
    } else if (typeof source === 'string') {
      this.configJsonObj = configJsonFactory.createConfigJson('npm', source);
    } else {
      throw new Error('Unknown source: ' + source, 'check-if.js');
    }
    return this;
  },

  passesTheFilter: function (filterBy) {

    var keywords = null;

    if (typeof this.configJsonObj === 'undefined') {
      throw new Error('this.configJsonObj is not defined', 'check-if.js');
    }

    if (typeof filterBy === 'undefined' || typeof filterBy.keyword === 'undefined') {
      return true;
    }

    if (typeof filterBy.keyword === 'string') {
      keywords = [filterBy.keyword];
    } else {
      keywords = filterBy.keyword;
    }
    for (var i = 0, length = keywords.length; i < length; i++) {
      if(this.configJsonObj.has.not.keyword(keywords[i])){
        return false;
      }
    }

    return true;
  },

  doesntPassTheFilter: function (filterBy) {
    return !this.passesTheFilter(filterBy);
  }

};

module.exports = function () {
  return new CheckIf();
};
