/* jshint node: true */
'use strict';

var BowerJson = require('../json/bower-json.js'),
    PackageJson = require('../json/package-json.js'),
    configJsonFactory = require('../json/config-json-factory.js');

function CheckIf() {}

CheckIf.prototype = {

  /**
   * This method adds readability to ConfigJson filtering.
   * If source param is a path, returns either a BowerJson or a PackageJson
   * @param  {ConfigJson/String} source   ConfigJson or path to it
   * @param  {String} configManager       Package manager: 'npm' or 'bower'
   * @return {ConfigJson}                 This method returns either a BowerJson or a PackageJson
   */
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
   * This method adds readability to BowerJson filtering.
   * If source param is a path, returns a new BowerJson object. 
   * 
   * @param  {BowerJson/String} source  BowerJson to check or path to it
   * @return {BowerJson}                This method returns a BowerJson
   */
  bowerJson: function checkIfBowerJson(source) {
    if (typeof source === 'undefined') {
      throw new Error('"source" param is required.', 'check-if.js');
    }
    if (source instanceof BowerJson) {
      this.configJsonObj = source;
    } else if (typeof source === 'string') {
      this.configJsonObj = configJsonFactory.createConfigJson(source, 'bower');
    } else {
      throw new TypeError('Unknown source: ' + source, 'check-if.js');
    }
    return this;
  },

  /**
   * This method adds readability to PackageJson filtering.
   * If source param is a path, returns a new BowerJson object. 
   * 
   * @param  {PackageJson/String} source  PackageJson to check or path to it
   * @return {PackageJson}                This method returns a PackageJson
   */
  packageJson: function checkIfPackageJson(source) {
    if (typeof source === 'undefined') {
      throw new Error('"source" param is required.', 'check-if.js');
    }
    if (source instanceof PackageJson) {
      this.configJsonObj = source;
    } else if (typeof source === 'string') {
      this.configJsonObj = configJsonFactory.createConfigJson(source, 'npm');
    } else {
      throw new Error('Unknown source: ' + source, 'check-if.js');
    }
    return this;
  },

  /**
   * Checks whether the ConfigJson of this instance passes the given filter
   * @param  {Object} filterBy   The filter to check
   * @return {Boolean}           This method returns true if it passes the filter, else false.
   */
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


  /**
   * Checks whether the ConfigJson of this instance doesn't pass the given filter
   * @param  {Object} filterBy   The filter to check
   * @return {Boolean}           This method returns true if it doesn't pass the filter, else false.
   */
  doesntPassTheFilter: function (filterBy) {
    return !this.passesTheFilter(filterBy);
  }

};

module.exports = function () {
  return new CheckIf();
};
