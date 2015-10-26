var src = 'src';
var dist = 'dist';
var contextGenerator = '/ContextGenerator';
var cpsAnalytics = '/CPSAnalytics';
var servers = '/Servers';

var clientBuildSettings = require('../webpack.config');

module.exports = {
  src: 'src',
  srcContextGenerator: src + contextGenerator,
  srcCPSAnalytics: src + cpsAnalytics,
  srcServers: src + servers,

  dist: dist,
  distContextGenerator: dist + contextGenerator,
  distCPSAnalytics: dist + cpsAnalytics,
  distServer: dist + servers,

  distDocs: dist + '/docs',

  unitTests: 'dist/**/*.spec.js',
  integrationTests: 'dist/**/*.test.js',

  testRunner: {
    timeout: 5000,
    istanbul: false
  },

  clientBuildSettings: clientBuildSettings
};
