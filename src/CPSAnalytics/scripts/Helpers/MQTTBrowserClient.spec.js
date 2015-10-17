/*jshint -W030 */
import {expect} from 'chai';
import MQTTClient from './MQTTBrowserClient';

describe('MQTT Browser Client', function() {
  let client;

  before(function() {
    client = new MQTTClient('ws://localhost:3000');
  });

  describe('subscribe', function() {
    it('should subscribe to a topic', function() {
      expect(client.subscribe('context')).not.to.throw;
    });
  });
});
