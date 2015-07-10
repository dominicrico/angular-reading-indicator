/* License: MIT.
 * Copyright (C) 2015, Dominic Rico-Gomez.
 */

'use strict';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    autoWatch: true,
    reporters: ['dots', 'coverage'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'src/ng-reading-indicator.js',
      'tests.js'
    ],
    preprocessors: {
      'src/ng-reading-indicator.js': 'coverage'
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    }
  });
};
