import log from '../ContextGenerator/Helper/Logger';
import opcua from 'node-opcua';

let server = new opcua.OPCUAServer({
  port: 4334
});

server.initialize(function() {
  server.engine.createFolder('ObjectsFolder', { browseName: 'TemperatureSensors'});
  server.engine.createFolder('ObjectsFolder', { browseName: 'SmokeSensors'});

  server.temperature1 = addVariable('TemperatureSensors',
                                    'TemperatureSensor#1',
                                    'ns=0;s=temperature_sensor_1',
                                    20);

  server.temperature2 = addVariable('TemperatureSensors',
                                    'TemperatureSensor#2',
                                    'ns=0;s=temperature_sensor_2',
                                    60);

  server.temperature3 = addVariable('TemperatureSensors',
                                    'TemperatureSensor#3',
                                    'ns=0;s=temperature_sensor_3',
                                    20);

  server.smoke1 = addVariable('SmokeSensors',
                              'SmokeSensor#1',
                              'ns=0;s=smoke_sensor_1',
                              10);

  server.smoke2 = addVariable('SmokeSensors',
                              'SmokeSensor#2',
                              'ns=0;s=smoke_sensor_2',
                              40);

  server.smoke3 = addVariable('SmokeSensors',
                              'SmokeSensor#3',
                              'ns=0;s=smoke_sensor_3',
                              10);

  server.start(function() {
    log.info('OPC Test-Server is now listening on', server.endpoints[0].port);
  });
});

function addVariable(folder, name, nodeId, treshold) {
  let value = treshold;
  setInterval(function() {
    const aboveTreshold = value > treshold + 10;
    const underTreshold = value < treshold - 10;

    if (aboveTreshold) {
      value -= 10;
    } else if (underTreshold) {
      value += 10;
    } else {
      value += Math.floor(Math.random() * (5 - (-5) + 1)) + (-5);
    }
  }, 500);

  return server.engine.addVariableInFolder(folder, {
    nodeId: nodeId,
    browseName: name,
    dataType: 'Double',
    value: {
      get: function() {
        return new opcua.Variant({dataType: opcua.DataType.Double, value});
      }
    }
  });
}
