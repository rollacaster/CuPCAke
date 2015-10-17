import log from '../ContextGenerator/Helper/Logger';
import coap from 'coap';

const server = coap.createServer();

let lightSensor = {
  light: 20
};

//Port is 5683
server.listen(() => {
  log.info('CoAP Test-Server listening on port 5683');
  setInterval(() => {
    var req = coap.request({pathname: 'lightSensor1', method: 'POST'});
    lightSensor.light += Math.random();
    req.write(lightSensor.light.toString());
    req.end();
  }, 2000);
});

let stream;

server.on('request', function(req, res) {
  if (req.method === 'POST') {
    stream.write(req.payload);
  } else if (req.headers.Observe === 0) {
    stream = res;
  } else {
    res.end('connected');
  }
});
