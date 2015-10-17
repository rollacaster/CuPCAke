import os from 'os';

export const cpsFixture = {
  name: 'weather',
  connections: [
    `opc.tcp://${os.hostname()}:4334`
  ]
};

export const entityTypeFixture = {
  name: 'TemperatureSensor'
};
