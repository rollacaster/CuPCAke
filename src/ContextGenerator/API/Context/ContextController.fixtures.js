export const contextSubscription = {
  topic: 'contextTest',
  realtime: true,
  queries: [{
    cps: 'Weather',
    type: 'TemperatureSensor',
    entity: 'TemperatureSensor1',
    attribute: 'Temperature',
    label: 'MyTemperature'
  }]
};
