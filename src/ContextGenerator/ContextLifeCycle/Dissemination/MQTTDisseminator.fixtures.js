export const contexts = {
  weather: {
    cps: 'Weather',
    time: '2015-04-25T22:13:23.000Z',
    entities: [
      {
        type: 'TemperatureSensor',
        time: '2015-04-25T22:13:23.000Z',
        name: 'TemperatureSensor1',
        attributes: {
          Temperature: {
            time: '2015-04-25T22:13:23.000Z',
            value: '15'
          }
        }
      }
    ]
  }
};

export const requests = {
  MyTemperature: {
    topic: 'test',
    queries: [{
      cps: 'Weather',
      type: 'TemperatureSensor',
      entity: 'TemperatureSensor1',
      attribute: 'Temperature',
      label: 'MyTemperature'
    }]
  }
};

export const publish = {
  temperature: {
    MyTemperature: [{
      time: '2015-04-25T22:13:23.000Z',
      value: '15'
    }]
  }
};
