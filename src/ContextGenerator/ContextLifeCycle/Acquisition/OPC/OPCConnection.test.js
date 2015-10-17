/*jshint -W030 */
/*jshint -W079 */
import OPCConnection from './OPCConnection';
import os from 'os';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OPCConnection', function() {
  let connection;
  let testSubscription;

  before(function() {
    connection = new OPCConnection(`opc.tcp://${os.hostname()}:4334`);
  });

  describe('connect', function() {
    it('should connect to a OPCServer', function(done) {
      connection.connect().then(
        function(session) {
          expect(session).to.be.ok;
          done();
        });
    });

    it('should not connect to a OPCServer', function() {
      const badConnection = new OPCConnection(`opc.tcp://${os.hostname()}:4335`);
      expect(Promise.resolve(badConnection.connect)).to.eventually.be.rejected;
    });
  });

  describe('browse', function() {
    it('should browse a OPCServer', function(done) {
      connection.browse().then(
        function(nodes) {
          expect(nodes).not.to.be.empty;
          done();
        });
    });
  });

  describe('subscribe', function() {
    it('should subscribe to a value', function(done) {
      connection.subscribe('ns=0;s=temperature_sensor_3').then(
        function(subscription) {
          expect(subscription).not.to.be.empty;
          testSubscription = subscription;
          done();
        });
    });

    it('should receive a value', function(done) {
      connection.subscribe('ns=0;s=temperature_sensor_3').then(
        function(subscription) {
          expect(subscription).not.to.be.empty;

          subscription.once('changed', function(opcMessage) {
            expect(opcMessage.value.value).to.be.a('number');
            done();
          });
        });
    });
  });

  describe('unsubscribe', function() {
    it('should unsubscribe to a value', function(done) {
      connection.unsubscribe(testSubscription).then(function() {
        done();
      });
    });
  });
});
