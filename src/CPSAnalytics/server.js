import webFramework from 'express';
import httpServer from '../Servers/HTTPServer';
import log from '../ContextGenerator/Helper/Logger';
import path from 'path';

const port = 4000;

httpServer(port, __dirname).then(function(app) {
  log.info('HTTP Server with CPSAnalytics listening on %d', port);
});
