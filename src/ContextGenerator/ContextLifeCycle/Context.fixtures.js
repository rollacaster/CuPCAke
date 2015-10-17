export const contexts = {
  processed: {
    cps: 'weather',
    time: 1431867211000,
    entities: [
      {
        type: 'TemperatureSensor',
        time: 1431867211000,
        name: 'Sensor#1',
        attributes: {
          temperature: {
            time: 1431867211000,
            value: 13
          }
        }
      }
    ]
  }
};

export const cpsEvents = {
  OPC: { value:
         { dataType: undefined,
           arrayType: undefined,
           value: 13 },
         statusCode: { value: 0, description: 'No Error', name: 'Good' },
         sourceTimestamp: 'Sun May 17 2015 14:53:31 GMT+0200 (CEST)',
         sourcePicoseconds: 0,
         serverTimestamp: null,
         serverPicoseconds: 0
  }
};

export const contextDescription = {
  entityType: 'TemperatureSensor',
  entityName: 'Sensor#1',
  attribute: 'temperature',
  cps: 'weather'
};
