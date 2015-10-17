var build = require('gulp');
var config = require('../config');
var testRunner = require('gulp-spawn-mocha');
var codeLinter = require('gulp-jshint');
var checkStyle = require('gulp-jscs');
var runSequence = require('run-sequence');

build.task('test', function(done) {
  runSequence('test:setup', 
              ['test:unit', 'test:integration', 'styleCheck',
               'codeLint']);
});

build.task('test:unit', ['build:ContextGenerator'], function() {
  return build.src(config.unitTests)
              .pipe(testRunner(config.testRunner));
});

build.task('test:setup', ['develop:MQTTBroker', 'develop:OPCServer', 'develop:CoAPServer',
                          'develop:ContextGenerator', 'develop:CPSAnalytics']);

build.task('test:integration', function() {
  build.src(config.integrationTests)
       .pipe(testRunner(config.testRunner))
       .once('end', function() {
         process.exit();
       });
});

build.task('styleCheck', function() {
  return build.src(config.src + '/**/*.js')
              .pipe(checkStyle(config.checkStyle));
});

build.task('codeLint', function() {
  return build.src(config.src + '/**/*.js')
              .pipe(codeLinter('.jshintrc'))
              .pipe(codeLinter.reporter('jshint-stylish'));
});
