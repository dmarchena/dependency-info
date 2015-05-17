/* jshint node: true */
'use strict';

var DependencyTree = require('./tree.js');

module.exports = {
  createTree: function(options) {
    var tree = new DependencyTree();
    tree.init(options);
    return tree;
  }
};