'use strict';
/** @module Config/Environment */
import path from 'path';
import _ from 'lodash';

import dev from './development';
import test from './test';

/** Environment configuration for ContxpextGenerator
   @typedef {object} EnvironmentConfiguration
   @property {string} env - The current environment.
   @property {string} root - Root path of the server.
   @property {string} url - URL of the server.
   @property {number} port - Port of the server.
   @property {boolean} isSeed - Checks if seed data should be loaded.
   @property {object} mongo - MongoDB configuration object.
   @property {string} mqttBroker - URL of the MQTTBroker.
*/

/**
 * Default environment configuration.
 * @type {module:Config/Environment~EnvironmentConfiguration}
*/
let defaultConfig = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Url of the server
  url: 'http://localhost',

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: true,

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    uri: 'mongodb://localhost/contextGenerator'
  },

  mqttBroker: 'ws://localhost:3000'
};

let environmentConfig = {};

switch (process.env.NODE_ENV){
  case 'development':
    environmentConfig = dev;
    break;
  case 'test':
    environmentConfig = test;
    break;
}

// Export the config object based on the NODE_ENV
// ==============================================
export default _.merge(
  defaultConfig,
  environmentConfig);
