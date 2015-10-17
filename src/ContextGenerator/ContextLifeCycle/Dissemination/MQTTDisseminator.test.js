import {expect} from 'chai';
import MQTTDisseminator from './MQTTDisseminator';
import MQTTConnection from '../Acquisition/MQTT/MQTTConnection';
import config from '../../Config/Environment';
import {contexts, requests, publish} from './MQTTDisseminator.fixtures';

describe('ContextSubscription', () => {
  const connection = new MQTTConnection(config.mqttBroker);
  before((done) => connection.connect().then(() => done()));

  it('should extract context according to subscription', (done) => {
    const {topic} = requests.MyTemperature;
    connection.subscribe(topic).then(() => {
      const subscription = new MQTTDisseminator(requests.MyTemperature, 0.5);
      connection.receive((receivedTopic, data) => {
        expect(receivedTopic).to.be.deep.equal(topic);
        expect(JSON.parse(data))
                   .to.be.deep.equal(publish.temperature);
        done();
      });

      subscription.contextUpdate(contexts.weather);
      subscription.contextUpdate({done: true});
    });
  });
});
