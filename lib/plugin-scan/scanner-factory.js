'use strict';

function ScannerFactory() {}

ScannerFactory.prototype = (function(){

	var scannerTypes = {
		'npm': {
			name: 'NpmScanner',
			require: './npm-scanner.js'
		},
		'bower': {
			name: 'BowerScanner',
			require: './bower-scanner.js'
		}
	};

	var createScanner = function createScanner(type) {
		var instance = null,
			constructor = null;

		if ( !(type in scannerTypes) ) {
			return null;
		}
		for (var t in scannerTypes) {
			if (t === type) {
				constructor = require(scannerTypes[t].require);
				instance = new constructor();
			}
		}

		return instance;
	};

	return {
		createScanner: createScanner
	};

}());

module.exports = new ScannerFactory();