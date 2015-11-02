var src = 'src';
var dist = 'dist';
var contextGeneratorPath = '/ContextGenerator';
var cpsAnalyticsPath = '/CPSAnalytics';
var serversPath = '/Servers';

var clientBuildSettings = require('../webpack.config');

module.exports = {
  src: 'src',
  srcContextGenerator: src + contextGeneratorPath,
  srcCPSAnalytics: src + cpsAnalyticsPath,
  srcServers: src + serversPath,

  dist: dist,
  distContextGenerator: dist + contextGeneratorPath,
  distCPSAnalytics: dist + cpsAnalyticsPath,
  distServer: dist + serversPath,

  distDocs: dist + '/docs',

  unitTests: 'dist/**/*.spec.js',
  integrationTests: 'dist/**/*.test.js',

  testRunner: {
    timeout: 5000,
    istanbul: false
  },

  clientBuildSettings: clientBuildSettings
};
