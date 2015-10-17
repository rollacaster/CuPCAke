'use strict';

/**
 * Development specific configuration.
 * @type {module:Config/Environment~EnvironmentConfiguration}
 * @name devConfig
 * @memberOf module:Config/Environment
*/
let devConfig = {
  // Url of the server
  url: 'http://localhost',

  // Development Server port
  port: 8080,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/contextGeneratorDev'
  },

  mqttBroker: 'mqtt://localhost:7000',

  seedDB: true
};

export default devConfig;
