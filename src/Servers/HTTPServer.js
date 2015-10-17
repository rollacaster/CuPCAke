//Is needed because build server runs node 0.10
require('babel/polyfill');

import http from 'http';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

export default function startHTTPServer(port, staticFolder) {
  let app = express();

  app.use(cors());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  if (staticFolder) { app.use(express.static(staticFolder)); }

  let server = http.createServer(app);
  return new Promise(function(resolve) {
    server.listen(port, function() {
      resolve(app);
    });
  });
}
