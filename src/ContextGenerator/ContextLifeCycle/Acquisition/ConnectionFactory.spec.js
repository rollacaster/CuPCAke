/*jshint -W030 */
import ConnectionFactory from './ConnectionFactory';
import MQTTConnection from './MQTT/MQTTConnection';
import OPCConnection from './OPC/OPCConnection';
import CoAPConnection from './CoAP/CoAPConnection';
import {expect} from 'chai';

describe('ConnectionFactory', function() {
  it('should create an OPCConnection', function() {
    const connection = ConnectionFactory('opc.tcp://localhost:4334');

    expect(connection).to.be.an.instanceOf(OPCConnection);
  });

  it('should create a MQTTConnection', function() {
    const connection = ConnectionFactory('mqtt://localhost:3000');

    expect(connection).to.be.an.instanceOf(MQTTConnection);
  });

  it('should create a CoAPConnection', function() {
    const connection = ConnectionFactory('coap://localhost:3000');

    expect(connection).to.be.an.instanceOf(CoAPConnection);
  });
});
