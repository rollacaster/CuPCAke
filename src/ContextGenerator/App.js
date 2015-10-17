/**
 * Main application file
 */

'use strict';

/**
 * Express app object.
 * @external App
 * @see {@link http://expressjs.com/4x/api.html#app}
*/

/**
 * Express request object.
 * @external Request
 * @see {@link http://expressjs.com/4x/api.html#req}
*/

/**
 * Express request object.
 * @external Response
 * @see {@link http://expressjs.com/4x/api.html#req}
*/

import 'source-map-support/register';
import config from '../ContextGenerator/Config/Environment';
import mongoose from 'mongoose';
import webFramework from 'express';
import httpServer from '../Servers/HTTPServer';
import httpServerConfig from './Config/HTTPConfig';
import routes from './Routes';
import log from './Helper/Logger';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if (config.seedDB) { require('./Config/Seed'); }

// Start HTTP-server
httpServer(config.port).then(function(app) {
  httpServerConfig(app);
  routes(app);
  log.info('HTTP Server with ContextGenerator listening on %d, in %s mode', config.port, app.get('env'));
});
