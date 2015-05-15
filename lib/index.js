'use strict';

var path = require('path');

var arin = exports = module.exports = {};

arin.getCoreSrc = function(){
    var corePath = path.join(__dirname, '../scss', 'index.scss');
    return corePath;
};

/*arin.getModules = function(){
    var mainPackageJson = utils.getMainPackageJson(),
        dependencies = [];
    for(var k in mainPackageJson.devDependencies) dependencies.push(k);
    return dependencies;
};*/