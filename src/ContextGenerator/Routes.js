/**
 * Main application routes
 */

'use strict';

import cpsRoutes from './API/CPS';
import contextRoutes from './API/Context';

export default function(app) {
  app.use('/v1/cps', cpsRoutes);
  app.use('/v1/context', contextRoutes);

  // Other routes return a 404
  app.get('/', function(req, res) {
    res.status(404);
    res.sendFile(app.get('views') + '/404.html');
  });
}
