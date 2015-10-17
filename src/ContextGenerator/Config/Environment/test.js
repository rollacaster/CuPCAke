'use strict';
/**
 * Test specific configuration.
 * @type {module:Config/Environment~EnvironmentConfiguration}
 * @name testConfig
 * @inner
 * @memberOf module:Config/Environment
*/
let testConfig = {
  // Url of the server
  url: 'http://localhost',

  // Test server port
  port: 7001,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/contextGeneratorTest'
  },

  mqttBroker: 'mqtt://localhost:7000',

  seedDB: false
};

export default testConfig;
