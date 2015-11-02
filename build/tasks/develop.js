var build = require('gulp');
var buildTasks = require('./build');
var config = require('../config');
var contextGeneratorServer = require('gulp-nodemon');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');

build.task('develop', function(done) {
  runSequence(['develop:OPCServer', 'develop:ContextGenerator',
               'develop:CPSAnalytics', 'develop:CoAPServer'],
              'develop:MQTTBroker');
});

build.task('develop:ContextGenerator', ['build:ContextGenerator'], function(done) {
  contextGeneratorServer({
    script: config.distContextGenerator + '/App.js',
    watch: config.srcContextGenerator,
    ext: 'js',
    env: {
      NODE_ENV: process.env.NODE_ENV
    },
    tasks: ['build:ContextGenerator']
  }).on('start', function() {
    done();
  });
});

build.task('develop:CPSAnalytics', ['build:CPSAnalytics'], function() {
  spawn('webpack-dev-server', ['--content-base', 'dist/CPSAnalytics', '--hot',
                               '--inline', '--port', '4000'], {stdio: 'inherit'}
  );
});

build.task('develop:MQTTBroker', ['build:devServers'], function() {
  //Start an MQTT-Broker for communication between ContextGenerator and CPSAnalytics
  require('../../' + config.distServer + '/MQTTBroker');
});

build.task('develop:OPCServer', ['build:devServers'], function() {
  //Start an OPC-Server which sends test data
  require('../../' + config.distServer + '/OPCServer');
});

build.task('develop:CoAPServer', ['build:devServers'], function() {
  //Start an CoAPServer which sends test data
  require('../../' + config.distServer + '/COAPServer');
});
