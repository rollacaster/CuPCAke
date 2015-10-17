import os from 'os';

export const cps = {
  name: 'weather',
  connections: [
    `opc.tcp://${os.hostname()}:4334`
  ]
};

export const invalidConnectionCPS = {
  name: 'weather',
  connections: [
    `opc.tcp://${os.hostname()}:4335`
  ]
};
