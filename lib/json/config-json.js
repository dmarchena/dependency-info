/* jshint node: true */
'use strict';

var path = require('path');

function ConfigJson(options) {
  var existsPathInOptions = !options || typeof options.path !== 'string',
      isPathToJsonFile;

  // Object properties
  this.path = null;
  this.defaultFilename = null;
  this.content = null;

  if (existsPathInOptions) {
    // options.path is required
    throw new Error('You have to pass the "path" to JSON file.', 'config-json.js', 17);
  }
  
  this.path = options.path;
  this.defaultFilename = 
    (typeof options.defaultFilename === 'string')?
    options.defaultFilename:
    null;

  isPathToJsonFile = /.+json$/.test(this.path);
  if (!isPathToJsonFile) {
    if (this.defaultFilename === null) {
      // If path points to the package dir and default file name is undefined an error is thrown
      throw new Error('"path" points to a directory, but I cannot find any "defaultFilename" in options.', 'config-json.js', 28);
    } else {
      // If path points to the package dir concat the default file name
      this.path = path.join(this.path, this.defaultFilename);
    }
  }

  try {
    this.content = require(this.path);
  } catch(e) {
    throw new Error('File not found: ' + this.path, 'config-json.js', 36);
  }

}

ConfigJson.prototype = {
  /**
   * Checks whether a config json contains the specified keyword
   * @param  {String}  keyword The keyword to search for
   * @return {Boolean}         This method return true if config json contains keyword, else false.
   */
  hasKeyword: function hasKeyword(keyword){
    for (var i = 0, length = (this.content.keywords)?this.content.keywords.length:0; i < length; i++){
      if (this.content.keywords[i] == keyword) {
        return true;
      }
    }
    return false;
  }
};

module.exports = ConfigJson;  