/* jshint node: true */
'use strict';

var DependencyTree = require('./tree.js'),
	Promise = require('bluebird');

var readTree = function readTree(options, callback) {
    var tree = new DependencyTree();
    tree.init(options, callback);
};
var readTreeSync = function readTreeSync(options) {
    var tree = new DependencyTree();
    tree.init(options);
    return tree;
};

module.exports = {
  readTree: Promise.promisify(readTree),
  readTreeSync: readTreeSync
};