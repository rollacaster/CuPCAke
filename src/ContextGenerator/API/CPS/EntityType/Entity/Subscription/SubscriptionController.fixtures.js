import os from 'os';

export const cpsFixture = {
  name: 'weather',
  connections: [
    `opc.tcp://${os.hostname()}:4334`,
    `mqtt://localhost:7000`,
    `coap://localhost`
  ]
};

export const entityTypeFixture = {
  name: 'TemperatureSensor'
};

export const entityFixture = {
  name: 'TemperatureSensor1'
};

export const subscriptionFixture = {
  connection: cpsFixture.connections[0],
  subscription: 'ns=0;s=temperature_sensor_3',
  sensed: ['value']
};

export const subscriptionFixtureMQTT = {
  connection: cpsFixture.connections[1],
  subscription: 'persons/mike',
  sensed: ['position.latitude']
};

export const subscriptionFixtureCoAP = {
  connection: cpsFixture.connections[2],
  subscription: 'lightsensors',
  sensed: ['light']
};
