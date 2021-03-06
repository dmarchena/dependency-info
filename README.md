# dependency-info 
[![Build Status](https://travis-ci.org/dmarchena/dependency-info.svg?branch=master)](https://travis-ci.org/dmarchena/dependency-info)
[![Coverage Status](https://coveralls.io/repos/dmarchena/dependency-info/badge.svg?branch=master)](https://coveralls.io/r/dmarchena/dependency-info?branch=master)
[![Dependency Status](https://david-dm.org/dmarchena/dependency-info.svg)](https://david-dm.org/dmarchena/dependency-info)
[![devDependency Status](https://david-dm.org/dmarchena/dependency-info/dev-status.svg)](https://david-dm.org/dmarchena/dependency-info#info=devDependencies)

Read useful info from your dependency tree. It supports both npm and bower.

:warning: **This package has been discontinued and deprecated.**

## Install

    npm install dependency-info

## Usage

First af all, you have to retrieve your dependency tree.

### The async way

    var dependencyInfo = require('dependency-info');
    dependencyInfo.readTree({
        manager: 'npm'
    })
    .then(function (tree) {
        ...
    })
    .catch(function (err) {
        ...
    });

### Of course, you can also get it synchronously

	var dependencyInfo = require('dependency-info')
	    list, 
	    tree;
	tree = dependencyInfo.readTreeSync({
		manager: 'npm'
	});
	
### Parameters
`readTree`and `readTreeSync` accept the same `options` param:

```
{
path:       {String}    path to module whose dependencies will be fetched. 
                        Default: process.cwd() 
manager:    {String}    Package manager: 'npm' or 'bower'
type:       {String}    All dependencies: 'all' (default)
            or
            {Array}     Accepted values: 'dependencies' and 'devDependencies'
deep:       {Boolean}   If true it search for all dependencies, not only the direct ones. 
                        Default value: false
filterBy:   
    {
        keyword: {Array} List of keywords the dependency must have
    }
}
```

## How to use this info

`Tree` object provides you a method to get a sorted Array of the information you need.

### tree.list(fields, order)

This method looks over the tree and returns an ordered array of key value objects filled with the specified fields, which will be taken from each dependency json file.

`fields` {Array}  
Property names form json files. You can also use 'path', which will contain the full path to dependency directory.  
`order` {String}  
Sort dependencies in ascending ('asc') or descending order ('desc')

## Examples

### Case 1: Getting path to main JS of your gulp plugins

```
var dependencyInfo = require('dependency-info');
dependencyInfo.readTree({
	manager: 'npm',
	filterBy: {
	    keyword: 'gulpplugin'
	}
})
.then(function (tree) {
	var list = tree.list(['name', 'path', 'main', 'files'], 'asc');
})
```

As a result, `list` and the following structure will be alike.

```
[ { name: 'gulp-autoprefixer',
    path: '/var/my-project/node_modules/gulp-autoprefixer',
    main: undefined,
    files: [ 'index.js' ] },
  { name: 'gulp-copy',
    path: '/var/my-project/node_modules/gulp-copy',
    main: 'index.js',
    files: undefined },
  { name: 'gulp-minify-css',
    path: '/var/my-project/node_modules/gulp-minify-css',
    main: undefined,
    files: [ 'index.js' ] },
  { name: 'gulp-prettify',
    path: '/var/my-project/node_modules/gulp-prettify',
    main: 'index.js',
    files: undefined },
  { name: 'gulp-rename',
    path: '/var/my-project/node_modules/gulp-rename',
    main: './index.js',
    files: [ 'index.js' ] },
  { name: 'gulp-sass',
    path: '/var/my-project/node_modules/gulp-sass',
    main: 'index.js',
    files: undefined },
  { name: 'gulp-strip-css-comments',
    path: '/var/my-project/node_modules/gulp-strip-css-comments',
    main: undefined,
    files: [ 'index.js' ] } ]
```

### Case 2: Logging version info synchronously

```
var dependencyInfo = require('dependency-info')
    list, 
    tree;
tree = dependencyInfo.readTreeSync({
	manager: 'npm'
});
list = tree.list(['name', 'version'], 'asc');
console.log(list);
```

This code will output a message like this:

```
[ { name: 'connect-livereload', version: '0.5.3' },
  { name: 'express', version: '4.12.3' },
  { name: 'gulp', version: '3.8.11' },
  { name: 'gulp-autoprefixer', version: '2.2.0' },
  { name: 'gulp-copy', version: '0.0.2' },
  { name: 'gulp-kit', version: '0.1.1' },
  { name: 'gulp-minify-css', version: '1.1.0' },
  { name: 'gulp-prettify', version: '0.3.0' },
  { name: 'gulp-rename', version: '1.2.2' },
  { name: 'gulp-sass', version: '1.3.3' },
  { name: 'gulp-strip-css-comments', version: '1.1.0' },
  { name: 'tiny-lr', version: '0.1.5' } ]
```

## License
MIT. See [LICENSE](https://github.com/dmarchena/dependency-info/blob/master/LICENSE) for details.
