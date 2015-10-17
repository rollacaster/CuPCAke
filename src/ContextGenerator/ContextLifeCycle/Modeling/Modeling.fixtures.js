export const cpsEvents = {
  person: {
    value: 'Michael',
    time: 1430000001000
  },
  temperature: {
    value: 20,
    time: 1430000002000
  },
  personUpdate: {
    value: 'Steve',
    time: 1430000003000
  }
};

export const descriptions = {
  person: {
    cps: 'iCATCH',
    entityType: 'Person',
    entityName: 'Person#1',
    attribute: 'name',
    modeling: 'JSON',
    statics: {test: 'test'}
  },
  temperature: {
    cps: 'iCATCH',
    entityType: 'TemperatureSensor',
    entityName: 'TemperatureSensor#1',
    attribute: 'temp',
    modeling: 'JSON',
    statics: {test: 'test'}
  }
};

export const contexts = {
  initial: {
    cps: 'iCATCH',
    time: 1430000000000,
    entities: []
  },
  person: {
    cps: 'iCATCH',
    time: 1430000001000,
    entities: [{
      type:'Person',
      time: 1430000001000,
      name:'Person#1',
      attributes: {
        name: {
          time: 1430000001000,
          value: 'Michael',
          statics: {test: 'test'}
        }
      }
    }]
  },
  temperature: {
    cps: 'iCATCH',
    time: 1430000002000,
    entities: [
      {
        type:'Person',
        time: 1430000001000,
        name:'Person#1',
        attributes: {
          name: {
            time: 1430000001000,
            value: 'Michael',
            statics: {test: 'test'}
          }
        }
      },
      {
        type:'TemperatureSensor',
        time: 1430000002000,
        name:'TemperatureSensor#1',
        attributes: {
          temp: {
            time: 1430000002000,
            value: 20,
            statics: {test: 'test'}
          }
        }
      }]
  },
  personUpdate: {
    cps: 'iCATCH',
    time: 1430000003000,
    entities: [
      {
        type:'Person',
        time: 1430000003000,
        name:'Person#1',
        attributes: {
          name: {
            time: 1430000003000,
            value: 'Steve',
            statics: {test: 'test'}
          }
        }
      },
      {
        type:'TemperatureSensor',
        time: 1430000002000,
        name:'TemperatureSensor#1',
        attributes: {
          temp: {
            time: 1430000002000,
            value: 20,
            statics: {test: 'test'}
          }
        }
      }]
  }
};
