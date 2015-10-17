'use strict';
/** @module Config */
import webFramework from 'express';
import config from './Environment';
import errorHandler from 'errorhandler';

/**
 * Configures an express application.
 * @alias httpConfig
 * @memberOf module:Config
 * @param {external:App} app - The express application.
*/
export default function(app) {
  var env = app.get('env');
  app.set('views', config.root + '/ContextGenerator/Views');
  app.use('/docs', webFramework.static(config.root + '/docs'));
  if (env === 'development' || env === 'test') {
    // Error handler - has to be last
    app.use(errorHandler());
  }
}
