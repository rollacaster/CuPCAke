/*jshint -W030 */
/*jshint -W079 */
import CoAPConnection from './CoAPConnection';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('CoAPClient', function() {
  let connection;

  before(() => connection = new CoAPConnection('coap://localhost'));

  describe('connect', function() {
    it('should connect to a coap server', function(done) {
      connection.connect().then(connected => {
        expect(connected).to.be.ok;
        done();
      });
    });

    it('should not connect to a coap sever', function() {
      const badConnection = new CoAPConnection(`coap://localhost:7001`);
      expect(Promise.resolve(badConnection.connect)).to.eventually.be.rejected;
    });
  });

  describe('subscribe', function() {
    it('should subscribe to a CoAP endpoint', function(done) {
      const endpoint = 'test';
      connection.subscribe(endpoint).then(subscription => {
        expect(subscription).to.be.ok;
        done();
      });
    });
  });
});
