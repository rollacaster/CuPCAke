/*jshint -W030*/
import log from '../../Helper/Logger';
import {expect} from 'chai';
import request from 'supertest';
import {contextSubscription} from './ContextController.fixtures';
import config from '../../Config/Environment';

const address = config.url + ':' + config.port + '/v1';

describe('Context Endpoint', () => {
  describe('post', () => {
    it('should stream a context', (done) => {
      request(address).post(`/context`)
                      .send(contextSubscription)
                      .expect(201)
                      .end((err, res) => {
                        if (err) {return done(err);}

                        done();
                      });
    });
  });

  describe('delete', () => {
    it('should stop the streaming of context', (done) => {
      request(address).delete(`/context?topic=${contextSubscription.topic}`)
                      .expect(201)
                      .end((err, res) => {
                        if (err) {return done(err);}

                        done();
                      });
    });

    it('should not find a subscription', (done) => {
      request(address).delete(`/context?topic=test`)
                      .expect(500)
                      .end((err, res) => {
                        if (err) {return done(err);}

                        expect(res.body.error.topic).to.be.equal('test');
                        done();
                      });
    });
  });
});
