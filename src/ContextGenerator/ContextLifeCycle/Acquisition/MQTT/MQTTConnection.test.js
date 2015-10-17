/*jshint -W030 */
/*jshint -W079 */
import MQTTConnection from './MQTTConnection';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MQTT Connection', function() {
  let connection;

  before(function() {
    connection = new MQTTConnection('mqtt://127.0.0.1:7000');
  });

  describe('connect', function() {
    it('should connect to a MQTTBroker', function(done) {
      connection.connect().then(connected => {
        expect(connected).to.be.ok;
        done();
      });
    });

    it('should not connect to a MQTTBroker', function() {
      const badConnection = new MQTTConnection(`mqtt://127.0.0.1:7001`);
      expect(Promise.resolve(badConnection.connect)).to.eventually.be.rejected;
    });
  });

  describe('subscribe', function() {
    it('should subscribe to a MQTT topic', function(done) {
      const topic = 'test';
      connection.subscribe(topic).then(subscription => {
        expect(subscription).to.be.ok;
        done();
      });
    });
  });

  describe('publish', function() {
    it('publish a value', function() {
      expect(connection.publish('MQTTTest', {test: 'test'})).not.to.throw;
    });
  });
});
